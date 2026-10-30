import { sendAdminEmail } from '../src/mailer.ts';
import express, { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { db, hashPassword, verifyPassword, User } from './db.ts';
import {
  insertSupabaseBooking,
  insertSupabaseContactMessage,
  insertSupabaseUser,
  insertSupabaseVehicle,
} from './supabase.ts';

export const apiRouter = express.Router();
apiRouter.use(express.json({ limit: '15mb' }));

export const apiApp = express();
apiApp.use(express.json({ limit: '15mb' }));
apiApp.use('/api', apiRouter);
apiApp.use(apiRouter);

const sessions = new Map<string, { userId: string; expiresAt: number }>();

export function createSessionToken(userId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    userId,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

export function getUserFromToken(token?: string): User | null {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  const user = db.getUserById(session.userId);
  return user || null;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  const user = getUserFromToken(token);

  if (!user || !user.isActive) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  req.user = user;
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  const user = getUserFromToken(token);

  if (!user || !user.isActive || (user.role !== 'admin' && user.role !== 'fleet_manager')) {
    return res.status(403).json({ error: 'Access denied: Administrator privileges required.' });
  }

  req.user = user;
  next();
}

// ----------------- AI CHAT AGENT ENDPOINT (Multilingual Support) -----------------
apiRouter.post('/chat-agent', (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A message is required.' });
    }

    const query = message.toLocaleLowerCase();
    const hasTamilScript = /[\u0B80-\u0BFF]/u.test(message);
    const hasSinhalaScript = /[\u0D80-\u0DFF]/u.test(message);
    const tanglishMarkers = [
      'vanakkam',
      'irukka',
      'irukkaa',
      'venum',
      'vandi',
      'vaahanam',
      'evlo',
      'evalo',
      'enna',
      'kidaikkuma',
      'kidaikuma',
      'naal',
      'oru',
      'engal',
      'enga',
      'ungal',
      'ungalukku',
      'nalla',
      'sollunga',
      'pannunga',
    ];
    const hasTanglish = tanglishMarkers.some((term) =>
      new RegExp(`(^|[^a-z])${term}([^a-z]|$)`, 'i').test(query),
    );
    const language = hasTamilScript ? 'ta' : hasSinhalaScript ? 'si' : hasTanglish ? 'tanglish' : 'en';
    const vehicles = db.getVehicles().filter((vehicle) => vehicle.status !== 'archived');
    const categories = {
      economy: {
        en: 'Economy',
        ta: 'சிக்கன வகை',
        si: 'ආර්ථික',
        tanglish: 'Economy',
        terms: ['economy', 'budget', 'எகானமி', 'சிக்கன', 'ආර්ථික', 'ඉකොනමි'],
      },
      sedan: {
        en: 'Sedan',
        ta: 'செடான்',
        si: 'සෙඩාන්',
        tanglish: 'Sedan',
        terms: ['sedan', 'செடான்', 'செடன்', 'සෙඩාන්'],
      },
      suv: {
        en: 'SUV',
        ta: 'SUV',
        si: 'SUV',
        tanglish: 'SUV',
        terms: ['suv', 'எஸ்யூவி', 'எஸ்யுவி', 'එස්යූවී', 'එස්යුවී', 'prado', 'velar'],
      },
      luxury: {
        en: 'Luxury',
        ta: 'சொகுசு',
        si: 'සුඛෝපභෝගී',
        tanglish: 'Luxury',
        terms: ['luxury', 'premium', 'சொகுசு', 'ஆடம்பர', 'සුඛෝපභෝගී', 'ලක්සරි'],
      },
      van: {
        en: 'Van',
        ta: 'வேன்',
        si: 'වෑන්',
        tanglish: 'Van',
        terms: ['van', 'வேன்', 'වෑන්'],
      },
      sports: {
        en: 'Sports',
        ta: 'ஸ்போர்ட்ஸ்',
        si: 'ක්‍රීඩා',
        tanglish: 'Sports',
        terms: ['sports', 'sport', 'ஸ்போர்ட்ஸ்', 'விளையாட்டு', 'ක්‍රීඩා', 'ස්පෝර්ට්ස්'],
      },
    } as const;

    const requestedCategory = (Object.keys(categories) as Array<keyof typeof categories>)
      .find((category) => categories[category].terms.some((term) => query.includes(term)));
    const categoryKeys = requestedCategory
      ? [requestedCategory]
      : (Object.keys(categories) as Array<keyof typeof categories>);
    const rateSummary = categoryKeys
      .map((category) => {
        const categoryVehicles = vehicles.filter((vehicle) => vehicle.category === category);
        if (categoryVehicles.length === 0) return null;

        const rates = categoryVehicles.map((vehicle) => vehicle.dailyRate);
        const minimumRate = Math.min(...rates).toLocaleString('en-LK');
        const maximumRate = Math.max(...rates).toLocaleString('en-LK');
        const rateRange = minimumRate === maximumRate
          ? `LKR ${minimumRate}`
          : `LKR ${minimumRate}–${maximumRate}`;

        const perDay = language === 'ta'
          ? 'நாள்'
          : language === 'si'
          ? 'දිනකට'
          : language === 'tanglish'
          ? 'naal-ku'
          : 'day';
        return `${categories[category][language]}: ${rateRange}/${perDay}`;
      })
      .filter((line): line is string => line !== null);

    const asksAboutChauffeur = [
      'chauffeur',
      'driver',
      'சாரதி',
      'ஓட்டுநர்',
      'டிரைவர்',
      'රියදුරු',
      'රියැදුරු',
      'driver venum',
      'chauffeur venum',
      'saarathi',
    ].some((term) => query.includes(term));
    const localizedReply = {
      en: `Hello! Here are our vehicle categories and daily rates:\n${rateSummary.join('\n')}${asksAboutChauffeur ? '\nProfessional chauffeur service is available for an additional LKR 5,000 per day.' : ''}\nRates are shown in LKR. Select your rental dates to check availability.`,
      ta: `வணக்கம்! எங்கள் வாகன வகைகள் மற்றும் தினசரி வாடகைக் கட்டணங்கள்:\n${rateSummary.join('\n')}${asksAboutChauffeur ? '\nதொழில்முறை சாரதி சேவை நாளொன்றுக்கு கூடுதல் LKR 5,000 கட்டணத்தில் கிடைக்கும்.' : ''}\nகட்டணங்கள் LKR-இல் காட்டப்பட்டுள்ளன. கிடைப்பைச் சரிபார்க்க வாடகை தேதிகளைத் தேர்ந்தெடுக்கவும்.`,
      si: `ආයුබෝවන්! අපගේ වාහන කාණ්ඩ සහ දෛනික කුලී ගාස්තු:\n${rateSummary.join('\n')}${asksAboutChauffeur ? '\nවෘත්තීය රියදුරු සේවාව දිනකට අමතර LKR 5,000 ක ගාස්තුවකට ලබා ගත හැක.' : ''}\nගාස්තු LKR වලින් දක්වා ඇත. ලබාගත හැකි බව පරීක්ෂා කිරීමට කුලී දිනයන් තෝරන්න.`,
      tanglish: `Vanakkam! Engal kitta irukkira vehicle categories-oda daily rates:\n${rateSummary.join('\n')}${asksAboutChauffeur ? '\nProfessional driver/chauffeur service oru naal-ku extra LKR 5,000-ku kidaikkum.' : ''}\nRates LKR-la. Availability check panna pickup dates select pannunga.`,
    };

    res.json({ reply: localizedReply[language] });
  } catch (err) {
    console.error('Failed to generate multilingual AI response:', err);
    res.status(500).json({ error: 'Failed to generate AI response.' });
  }
});

// ----------------- IMAGE UPLOAD ENDPOINT -----------------
apiRouter.post('/upload-image', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 data.' });
    }

    const publicImagesDir = path.resolve(process.cwd(), 'public', 'images');
    const assetsImagesDir = path.resolve(process.cwd(), 'src', 'assets', 'images');
    if (!fs.existsSync(publicImagesDir)) {
      fs.mkdirSync(publicImagesDir, { recursive: true });
    }
    if (!fs.existsSync(assetsImagesDir)) {
      fs.mkdirSync(assetsImagesDir, { recursive: true });
    }

    const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) {
      if (imageBase64.startsWith('/') || imageBase64.startsWith('http')) {
        return res.json({ imageUrl: imageBase64 });
      }
      return res.status(400).json({ error: 'Invalid base64 image format.' });
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const safeName = (filename || 'vehicle_upload').replace(/[^a-zA-Z0-9-_]/g, '_');
    const newFilename = `${safeName}_${Date.now()}.${ext}`;
    
    fs.writeFileSync(path.join(publicImagesDir, newFilename), Buffer.from(base64Data, 'base64'));
    try {
      fs.writeFileSync(path.join(assetsImagesDir, newFilename), Buffer.from(base64Data, 'base64'));
    } catch {}

    const publicUrl = `/images/${newFilename}`;

    res.json({
      message: 'Vehicle image uploaded successfully.',
      imageUrl: publicUrl,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to upload image.' });
  }
});

// ----------------- AUTH ROUTES -----------------
apiRouter.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Please provide all required fields (name, email, phone, password).' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format.' });
    }

    const passwordHash = hashPassword(password);
    const user = db.prepareUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      passwordHash,
      role: 'customer',
      isActive: true,
    });

    try {
      const databaseUser = await insertSupabaseUser(user);
      console.log('[Supabase] User registration insert response:', databaseUser);
    } catch (error) {
      console.error('[Supabase] User registration insert failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to save registration to Supabase.';
      return res.status(500).json({ error: message });
    }

    db.saveUser(user);
    const token = createSessionToken(user.id);
    const { passwordHash: _, ...safeUser } = user;

    res.status(201).json({
      message: 'Account registered successfully.',
      user: safeUser,
      token,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.getUserByEmail(email.trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Your account has been deactivated. Please contact support.' });
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = createSessionToken(user.id);
    const { passwordHash: _, ...safeUser } = user;

    db.addAuditLog({
      userId: user.id,
      action: 'USER_LOGIN',
      resourceType: 'auth',
      resourceId: user.id,
      details: { role: user.role, email: user.email },
    });

    res.json({
      message: 'Logged in successfully.',
      user: safeUser,
      token,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed.' });
  }
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  const user = getUserFromToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Session expired or invalid.' });
  }

  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

apiRouter.put('/auth/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, phone, address, driverLicenseNumber } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required fields.' });
    }

    const updated = db.updateUser(req.user!.id, {
      name: name.trim(),
      phone: phone.trim(),
      address: address?.trim(),
      driverLicenseNumber: driverLicenseNumber?.trim(),
    });

    const { passwordHash: _, ...safeUser } = updated;
    res.json({ message: 'Profile updated successfully.', user: safeUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update profile.' });
  }
});

// ----------------- VEHICLE ROUTES -----------------
apiRouter.get('/vehicles', (req: Request, res: Response) => {
  try {
    const { search, category, minPrice, maxPrice, transmission, seats, location, pickupDate, returnDate, sortBy } = req.query;

    let list = db.getVehicles().filter((v) => v.status !== 'archived');

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((v) => v.name.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q) || v.location.toLowerCase().includes(q));
    }

    if (category && category !== 'all') {
      list = list.filter((v) => v.category === category);
    }

    if (minPrice) {
      list = list.filter((v) => v.dailyRate >= parseFloat(minPrice as string));
    }
    if (maxPrice) {
      list = list.filter((v) => v.dailyRate <= parseFloat(maxPrice as string));
    }

    if (transmission && transmission !== 'all') {
      list = list.filter((v) => v.transmission === transmission);
    }

    if (seats && seats !== 'all') {
      const minSeats = parseInt(seats as string, 10);
      list = list.filter((v) => v.seatingCapacity >= minSeats);
    }

    if (location && location !== 'all') {
      list = list.filter((v) => v.location.toLowerCase().includes((location as string).toLowerCase()));
    }

    if (pickupDate && returnDate) {
      list = list.filter((v) => db.isVehicleAvailable(v.id, pickupDate as string, returnDate as string));
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.dailyRate - b.dailyRate);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.dailyRate - a.dailyRate);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json({ vehicles: list, total: list.length, currency: 'LKR' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch vehicles.' });
  }
});

apiRouter.get('/vehicles/:id', (req: Request, res: Response) => {
  const vehicle = db.getVehicleById(req.params.id);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found.' });
  }
  res.json({ vehicle });
});

apiRouter.post('/vehicles/check-availability', (req: Request, res: Response) => {
  const { vehicleId, pickupDate, returnDate } = req.body;

  if (!vehicleId || !pickupDate || !returnDate) {
    return res.status(400).json({ error: 'vehicleId, pickupDate, and returnDate are required.' });
  }

  const isAvailable = db.isVehicleAvailable(vehicleId, pickupDate, returnDate);
  const vehicle = db.getVehicleById(vehicleId);

  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found.' });
  }

  const start = new Date(pickupDate).getTime();
  const end = new Date(returnDate).getTime();
  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const subtotal = vehicle.dailyRate * days;
  const insurance = vehicle.insuranceFeePerDay * days;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + insurance + tax + vehicle.depositAmount;

  res.json({
    isAvailable,
    rentalDays: days,
    dailyRate: vehicle.dailyRate,
    currency: 'LKR',
    rentalSubtotal: subtotal,
    insuranceTotal: insurance,
    taxTotal: tax,
    depositAmount: vehicle.depositAmount,
    totalAmount: total,
  });
});

// ----------------- MY BOOKINGS ROUTE -----------------
apiRouter.get('/my-bookings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUser = req.user!;
    const userBookings = db.getBookingsByUserId(currentUser.id).map((b) => {
      const vehicle = db.getVehicleById(b.vehicleId);
      const payment = db.getPaymentByBookingId(b.id);
      return {
        ...b,
        vehicle: vehicle || null,
        payment: payment || null,
      };
    });

    res.json({ bookings: userBookings, currency: 'LKR' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch user bookings.' });
  }
});

// ----------------- BOOKINGS ROUTES -----------------
apiRouter.post('/bookings', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { vehicleId, pickupDate, returnDate, pickupLocation, returnLocation, specialRequests } = req.body;

    if (!vehicleId || !pickupDate || !returnDate || !pickupLocation || !returnLocation) {
      return res.status(400).json({ error: 'Missing mandatory booking parameters.' });
    }

    const result = db.prepareBooking({
      userId: req.user!.id,
      vehicleId,
      pickupDate,
      returnDate,
      pickupLocation,
      returnLocation,
      specialRequests,
    });

    let persistedBooking;
    try {
      persistedBooking = await insertSupabaseBooking(result.booking);
    } catch (error) {
      console.error('[Supabase] Booking insert failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to insert booking into Supabase.';
      return res.status(500).json({ error: message });
    }

    console.log('[Supabase] Booking insert response:', persistedBooking);
    db.commitBooking(result);

    const user = db.getUserById(req.user!.id) || req.user!;
    const vehicle = db.getVehicleById(vehicleId);
    const vehicleName = vehicle ? vehicle.name : 'Unknown Vehicle';
    const formattedPrice = `Rs. ${Number(result.booking.totalAmount).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const adminEmailContent = `
      <h2>🚗 New Vehicle Booking Received!</h2>
      <p><strong>Booking Reference:</strong> ${result.booking.bookingReference}</p>
      <p><strong>Customer Name:</strong> ${user.name}</p>
      <p><strong>Customer Email:</strong> ${user.email}</p>
      <p><strong>Vehicle:</strong> ${vehicleName}</p>
      <p><strong>Rental Dates:</strong> ${result.booking.pickupDate} to ${result.booking.returnDate}</p>
      <p><strong>Pickup Location:</strong> ${pickupLocation}</p>
      <p><strong>Total Amount:</strong> ${formattedPrice}</p>
    `;

    const userEmailContent = `
      <h2>🎉 Reservation Received - Velocita Prestige Fleet</h2>
      <p>Dear <strong>${user.name}</strong>,</p>
      <p>Thank you for choosing Velocita! Your reservation request has been received. Complete payment to confirm your booking.</p>
      <hr />
      <p><strong>Booking Reference:</strong> ${result.booking.bookingReference}</p>
      <p><strong>Reserved Vehicle:</strong> ${vehicleName}</p>
      <p><strong>Pickup Date:</strong> ${result.booking.pickupDate}</p>
      <p><strong>Return Date:</strong> ${result.booking.returnDate}</p>
      <p><strong>Pickup Location:</strong> ${pickupLocation}</p>
      <p><strong>Total Estimated Amount:</strong> ${formattedPrice}</p>
      <hr />
      <p>Our team will contact you shortly regarding vehicle handover and deposit verification. Safe travels!</p>
    `;

    const notificationResults = await Promise.allSettled([
      sendAdminEmail(`New Booking Received: ${result.booking.bookingReference} (${user.name})`, adminEmailContent),
      sendAdminEmail(`Booking Confirmation - ${result.booking.bookingReference}`, userEmailContent, user.email),
    ]);
    const notificationsSent = notificationResults.every((notification) => notification.status === 'fulfilled');
    notificationResults.forEach((notification) => {
      if (notification.status === 'rejected') {
        console.warn('[Mailer Warning] Failed to send a booking notification:', notification.reason);
      }
    });

    res.status(201).json({
      message: notificationsSent
        ? 'Reservation created and notification emails sent to the customer and administrator. Complete payment to confirm the booking.'
        : 'Reservation created, but one or more notification emails could not be sent. Complete payment to confirm the booking.',
      booking: result.booking,
      payment: result.payment,
      notificationsSent,
      currency: 'LKR',
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to complete booking.' });
  }
});

apiRouter.post('/bookings/:id/pay', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { paymentMethod } = req.body as { paymentMethod?: string };
  if (paymentMethod !== 'credit_card' && paymentMethod !== 'debit_card') {
    return res.status(400).json({ error: 'A valid card payment method is required.' });
  }

  try {
    const result = db.processDummyPayment(req.params.id, req.user!.id, paymentMethod);
    res.json({
      message: 'Dummy payment recorded. No card details were collected.',
      ...result,
    });
  } catch (err: any) {
    const status = err.message === 'Booking not found.' ? 404 : 400;
    res.status(status).json({ error: err.message || 'Failed to process payment.' });
  }
});

// ----------------- CONTACT US -----------------
apiRouter.post('/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (
      typeof name !== 'string' || !name.trim()
      || typeof email !== 'string' || !email.trim()
      || typeof subject !== 'string' || !subject.trim()
      || typeof message !== 'string' || !message.trim()
      || (phone !== undefined && typeof phone !== 'string')
    ) {
      return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
    }

    const contactMessage = {
      id: `msg-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
      isResolved: false,
      createdAt: new Date().toISOString(),
    };
    const databaseResponse = await insertSupabaseContactMessage(contactMessage);
    console.log('[Supabase] Contact message insert response:', databaseResponse);
    db.saveContactMessage(contactMessage);

    try {
      await sendAdminEmail(`Contact Form: ${contactMessage.subject}`, `<p>${contactMessage.message}</p>`);
    } catch (error) {
      console.error('[Mailer Warning] Failed to send contact notification:', error);
    }
    res.status(201).json({ message: 'Message received successfully.', contactMessage });
  } catch (error) {
    console.error('[Supabase] Contact message insert failed:', error);
    const message = error instanceof Error ? error.message : 'Failed to submit contact request.';
    res.status(500).json({ error: message });
  }
});

// ----------------- ADMIN ROUTES -----------------
apiRouter.get('/admin/db-view', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const vehicles = db.getVehicles();
    const bookings = db.getBookings();
    const users = db.getUsers().map(({ passwordHash: _, ...user }) => user);

    console.info(
      `[admin-db-view] requested by ${req.user!.id}: vehicles=${vehicles.length}, bookings=${bookings.length}, users=${users.length}`,
    );
    res.set('Cache-Control', 'no-store').json({
      vehicles,
      bookings,
      users,
      counts: {
        vehicles: vehicles.length,
        bookings: bookings.length,
        users: users.length,
      },
    });
  } catch (error) {
    console.error('[admin-db-view] Failed to read database records.', error);
    res.status(500).json({ error: 'Failed to read database records.' });
  }
});

apiRouter.get('/admin/overview', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json({ metrics: db.getAdminMetrics() });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch metrics.' });
  }
});

apiRouter.get('/admin/vehicles', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({ vehicles: db.getVehicles(), currency: 'LKR' });
});

apiRouter.post('/admin/vehicles', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const newVehicle = db.prepareVehicle(req.body);
    try {
      const databaseResponse = await insertSupabaseVehicle(newVehicle);
      console.log('[Supabase] Vehicle insert response:', databaseResponse);
    } catch (error) {
      console.error('[Supabase] Vehicle insert failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to insert vehicle into Supabase.';
      return res.status(500).json({ error: message });
    }

    db.saveVehicle(newVehicle);
    res.status(201).json({ message: 'Vehicle added successfully.', vehicle: newVehicle, currency: 'LKR' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create vehicle.' });
  }
});

apiRouter.put('/admin/vehicles/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateVehicle(req.params.id, req.body);
    res.json({ message: 'Vehicle updated successfully.', vehicle: updated, currency: 'LKR' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update vehicle.' });
  }
});

apiRouter.delete('/admin/vehicles/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json(db.deleteVehicle(req.params.id));
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to delete vehicle.' });
  }
});

apiRouter.get('/admin/bookings', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const bookings = db.getBookings().map((b) => {
    const vehicle = db.getVehicleById(b.vehicleId);
    const user = db.getUserById(b.userId);
    const payment = db.getPaymentByBookingId(b.id);
    return {
      ...b,
      vehicleName: vehicle?.name || 'N/A',
      customerName: user?.name || 'N/A',
      customerEmail: user?.email || 'N/A',
      paymentStatus: payment?.status || 'unpaid',
      currency: 'LKR',
    };
  });
  res.json({ bookings, currency: 'LKR' });
});

apiRouter.get('/admin/customers', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const customers = db.getUsers().map(({ passwordHash, ...user }) => user);
  res.json({ customers, currency: 'LKR' });
});

apiRouter.get('/admin/payments', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({ payments: db.getPayments(), currency: 'LKR' });
});

apiRouter.get('/admin/audit-logs', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({ logs: db.getAuditLogs ? db.getAuditLogs() : [] });
});