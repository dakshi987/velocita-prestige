import { Vehicle, User, Booking } from '../types.ts';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    "id": "veh-001",
    "name": "Audi A6 Prestige S-Line",
    "brand": "Audi",
    "modelYear": 2025,
    "category": "sedan",
    "registrationNumber": "WP CAB-8822",
    "dailyRate": 28000,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "hybrid",
    "mileageLimit": 300,
    "location": "Colombo Central Terminal (Galle Face)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Matrix LED Lights",
      "Virtual Cockpit",
      "Bang & Olufsen 3D Sound",
      "Lane Assist",
      "Adaptive Cruise Control",
      "Heated Leather Seats"
    ],
    "description": "The Audi A6 Prestige blends sculpted elegance with advanced mild-hybrid performance. Whisper-quiet cruising on the Southern Expressway and Colombo city poise make it ideal for executive meetings and luxury airport transfers.",
    "insuranceFeePerDay": 3500,
    "depositAmount": 50000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-007",
    "name": "BMW 5 Series 530e M Sport",
    "brand": "BMW",
    "modelYear": 2025,
    "category": "sedan",
    "registrationNumber": "WP CAC-5540",
    "dailyRate": 32000,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "hybrid",
    "mileageLimit": 300,
    "location": "Bandaranaike International Airport (CMB VIP Hub)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "M Aerodynamics Package",
      "BMW Curved Display",
      "Harman Kardon Audio",
      "Wireless Apple CarPlay",
      "Parking Assistant Plus",
      "Panoramic Sunroof"
    ],
    "description": "Sporting agility meets corporate sophistication. The BMW 530e plug-in hybrid delivers effortless torque, premium leather upholstery, and pristine highway dynamics for business professionals.",
    "insuranceFeePerDay": 4000,
    "depositAmount": 60000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-008",
    "name": "Toyota Camry Hybrid Premium Executive",
    "brand": "Toyota",
    "modelYear": 2025,
    "category": "sedan",
    "registrationNumber": "WP CAD-1904",
    "dailyRate": 22000,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "hybrid",
    "mileageLimit": 350,
    "location": "Kandy Royal Pavilion Hub",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Toyota Safety Sense 3.0",
      "Rear Reclining Power Seats",
      "Dual-Zone Climate Control",
      "JBL 9-Speaker Audio",
      "Blind Spot Monitor",
      "Ultra-Quiet Cabin"
    ],
    "description": "Supreme reliability combined with executive rear seat comfort. Ideal for comfortable long-distance travel across Sri Lanka with exceptional fuel economy.",
    "insuranceFeePerDay": 3000,
    "depositAmount": 40000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-002",
    "name": "Range Rover Velar P380 R-Dynamic",
    "brand": "Land Rover",
    "modelYear": 2025,
    "category": "suv",
    "registrationNumber": "WP CAD-4011",
    "dailyRate": 48000,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "petrol",
    "mileageLimit": 250,
    "location": "Bandaranaike International Airport (CMB VIP Hub)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "All-Wheel Drive (AWD)",
      "Air Suspension",
      "Panoramic Glass Roof",
      "Meridian Surround Audio",
      "360° 3D Camera",
      "Terrain Response 2"
    ],
    "description": "Flush deployable handles and undeniable presence. The Velar provides peerless hill-country all-weather stability for trips to Nuwara Eliya, Kandy, or coastal tours along the Galle highway.",
    "insuranceFeePerDay": 5500,
    "depositAmount": 80000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-009",
    "name": "Toyota Land Cruiser Prado TX-L 4WD",
    "brand": "Toyota",
    "modelYear": 2025,
    "category": "suv",
    "registrationNumber": "WP CBG-9231",
    "dailyRate": 42000,
    "currency": "LKR",
    "seatingCapacity": 7,
    "transmission": "automatic",
    "fuelType": "diesel",
    "mileageLimit": 300,
    "location": "Colombo Central Terminal (Galle Face)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Full-Time 4WD with Low Range",
      "7 Comfortable Seats",
      "Triple-Zone Climate Control",
      "Cool Box Center Console",
      "Crawl Control",
      "Heavy-Duty Tow Bar"
    ],
    "description": "The undisputed king of Sri Lankan terrain. Effortlessly handles steep hill passes, wildlife safaris in Yala or Wilpattu, and executive convoys in pristine comfort.",
    "insuranceFeePerDay": 5000,
    "depositAmount": 75000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-010",
    "name": "BMW X5 xDrive40i M Sport 7-Seater",
    "brand": "BMW",
    "modelYear": 2025,
    "category": "suv",
    "registrationNumber": "WP CAJ-7711",
    "dailyRate": 52000,
    "currency": "LKR",
    "seatingCapacity": 7,
    "transmission": "automatic",
    "fuelType": "petrol",
    "mileageLimit": 250,
    "location": "Galle Fort Coastal Hub",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "TwinPower Turbo 375 HP",
      "Adaptive 2-Axle Air Suspension",
      "Sky Lounge Panoramic Roof",
      "Bowers & Wilkins Sound",
      "Gesture Control",
      "M Sport Brakes"
    ],
    "description": "Commanding luxury and sports agility. Accommodates up to 7 passengers with supreme comfort, high highway cruising speed, and intuitive digital amenities.",
    "insuranceFeePerDay": 6000,
    "depositAmount": 90000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-003",
    "name": "Aston Martin DBS Superleggera GT",
    "brand": "Aston Martin",
    "modelYear": 2025,
    "category": "luxury",
    "registrationNumber": "WP CBA-0007",
    "dailyRate": 125000,
    "currency": "LKR",
    "seatingCapacity": 2,
    "transmission": "automatic",
    "fuelType": "petrol",
    "mileageLimit": 200,
    "location": "Colombo Central Terminal (Galle Face)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Twin-Turbo V12 715 HP",
      "Carbon Ceramic Brakes",
      "Sport Exhaust with Active Valves",
      "Hand-stitched Alcantara",
      "Aeroblade II Downforce System"
    ],
    "description": "The pinnacle of Grand Touring. Clad in lightweight carbon composite, the DBS delivers breathless acceleration, symphonic exhaust acoustics, and magnetic presence for high-end weddings and VIP hospitality across Sri Lanka.",
    "insuranceFeePerDay": 15000,
    "depositAmount": 150000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-005",
    "name": "Mercedes-Benz S-Class 580 4MATIC",
    "brand": "Mercedes-Benz",
    "modelYear": 2025,
    "category": "luxury",
    "registrationNumber": "WP CAG-7777",
    "dailyRate": 85000,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "hybrid",
    "mileageLimit": 250,
    "location": "Colombo Central Terminal (Galle Face)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Executive Rear Lounge",
      "Active Ambient Lighting (64 Colors)",
      "Burmester 4D Sound",
      "Rear Axle Steering",
      "Heated & Cooled Massage Seats"
    ],
    "description": "The benchmark of luxury chauffeur driving in Sri Lanka. Effortless airmatic glide suspension, hot-stone massage chairs, and whisper-quiet cabin for diplomatic and executive travel.",
    "insuranceFeePerDay": 10000,
    "depositAmount": 120000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-011",
    "name": "Porsche Panamera 4 E-Hybrid Executive",
    "brand": "Porsche",
    "modelYear": 2025,
    "category": "luxury",
    "registrationNumber": "WP CAK-9009",
    "dailyRate": 95000,
    "currency": "LKR",
    "seatingCapacity": 4,
    "transmission": "automatic",
    "fuelType": "hybrid",
    "mileageLimit": 220,
    "location": "Bandaranaike International Airport (CMB VIP Hub)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Porsche Active Suspension Management (PASM)",
      "Sport Chrono Package",
      "Rear Seat Entertainment Displays",
      "Soft-Close Doors",
      "BOSE Surround Sound"
    ],
    "description": "Combining iconic Porsche sports car DNA with four-door limousine luxury. Exceptional ride comfort, striking road stance, and seamless plug-in hybrid response.",
    "insuranceFeePerDay": 12000,
    "depositAmount": 130000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-004",
    "name": "Mercedes-Benz V-Class Avantgarde VIP",
    "brand": "Mercedes-Benz",
    "modelYear": 2025,
    "category": "van",
    "registrationNumber": "WP ND-9102",
    "dailyRate": 32000,
    "currency": "LKR",
    "seatingCapacity": 8,
    "transmission": "automatic",
    "fuelType": "diesel",
    "mileageLimit": 350,
    "location": "Bandaranaike International Airport (CMB VIP Hub)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "8 Luxury Captain Seats",
      "Dual Electric Sliding Doors",
      "Burmester High-End Audio",
      "Rear Climate Control Zone",
      "Huge Luggage Capacity",
      "Folding Conference Table"
    ],
    "description": "The gold standard of executive tourism in Sri Lanka. 8 sumptuous leather seats, conference layout, dual AC zones, and ample luggage space for island round-trips and corporate delegations.",
    "insuranceFeePerDay": 4000,
    "depositAmount": 60000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-012",
    "name": "Toyota HiAce Super GL Commuter Luxury",
    "brand": "Toyota",
    "modelYear": 2025,
    "category": "van",
    "registrationNumber": "WP ND-4488",
    "dailyRate": 24000,
    "currency": "LKR",
    "seatingCapacity": 10,
    "transmission": "automatic",
    "fuelType": "diesel",
    "mileageLimit": 400,
    "location": "Colombo Central Terminal (Galle Face)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "10 Plush Reclining High-Back Seats",
      "Roof-Mounted Dual Air Conditioning",
      "Automatic Side Step & Power Door",
      "HDMI Overhead Video Entertainment",
      "Generous Luggage Hold"
    ],
    "description": "Sri Lanka’s most trusted long-distance passenger van. Roomy 10-seater configuration with whisper-quiet diesel engine, ice-cold dual AC, and maximum touring reliability from Colombo to Sigiriya, Ella, and Yala.",
    "insuranceFeePerDay": 3200,
    "depositAmount": 45000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-013",
    "name": "Mercedes-Benz Sprinter Executive Shuttle",
    "brand": "Mercedes-Benz",
    "modelYear": 2025,
    "category": "van",
    "registrationNumber": "WP NA-7120",
    "dailyRate": 38000,
    "currency": "LKR",
    "seatingCapacity": 12,
    "transmission": "automatic",
    "fuelType": "diesel",
    "mileageLimit": 350,
    "location": "Bandaranaike International Airport (CMB VIP Hub)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "12 VIP Ergonomic Recliners",
      "High Roof Stand-Up Cabin",
      "Independent Individual Reading Lights",
      "High-Output Rear Chiller AC",
      "USB Ports for Every Row",
      "Extra-Large Luggage Bay"
    ],
    "description": "Spacious high-roof executive shuttle for airline crews, destination weddings, and large travel groups. Stand-up headroom, individual airflow vents, and smooth Mercedes road manner.",
    "insuranceFeePerDay": 4800,
    "depositAmount": 70000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-014",
    "name": "Ford Transit Custom Tourneo Titanium",
    "brand": "Ford",
    "modelYear": 2025,
    "category": "van",
    "registrationNumber": "WP NC-3309",
    "dailyRate": 26000,
    "currency": "LKR",
    "seatingCapacity": 9,
    "transmission": "automatic",
    "fuelType": "diesel",
    "mileageLimit": 380,
    "location": "Kandy Royal Pavilion Hub",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "9 Flexible Conference Seats",
      "SYNC 4 13-Inch Touchscreen",
      "Dual Side Loading Doors",
      "Ford Co-Pilot360 Driver Assist",
      "Integrated Sunblinds"
    ],
    "description": "Modern, highly versatile passenger van built for hill-country touring and family getaways. Features flexible seating arrangements and smooth EcoBlue turbo diesel performance.",
    "insuranceFeePerDay": 3500,
    "depositAmount": 50000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-006",
    "name": "Hyundai i20 Premium Hatchback",
    "brand": "Hyundai",
    "modelYear": 2025,
    "category": "economy",
    "registrationNumber": "WP KX-1280",
    "dailyRate": 8500,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "petrol",
    "mileageLimit": 300,
    "location": "Kandy Royal Pavilion Hub",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Apple CarPlay & Android Auto",
      "Reverse Camera & Sensors",
      "High Fuel Efficiency (18 km/L)",
      "Digital Instrument Cluster",
      "Keyless Push Start"
    ],
    "description": "Compact, agile, and fuel-efficient. Perfect for navigating Colombo and Kandy city traffic with hassle-free parking, cold AC, and low fuel consumption.",
    "insuranceFeePerDay": 1500,
    "depositAmount": 25000,
    "createdAt": "2026-10-14T07:24:45.077Z",
    "updatedAt": "2026-10-14T07:24:45.077Z"
  },
  {
    "id": "veh-015",
    "name": "Suzuki Swift GLX Dualjet Automatic",
    "brand": "Suzuki",
    "modelYear": 2025,
    "category": "economy",
    "registrationNumber": "WP KY-8910",
    "dailyRate": 7500,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "petrol",
    "mileageLimit": 350,
    "location": "Colombo Central Terminal (Galle Face)",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Superb 20 km/L Mileage",
      "Touchscreen Infotainment",
      "Reverse Camera",
      "LED Projector Headlamps",
      "Automatic Climate Control"
    ],
    "description": "Sri Lanka’s favorite nimble city runner. Easy steering, excellent fuel economy, and zippy acceleration for urban commuting and coastal drives.",
    "insuranceFeePerDay": 1200,
    "depositAmount": 20000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  },
  {
    "id": "veh-016",
    "name": "Toyota Aqua Hybrid Smart Drive",
    "brand": "Toyota",
    "modelYear": 2025,
    "category": "economy",
    "registrationNumber": "WP KZ-3342",
    "dailyRate": 9200,
    "currency": "LKR",
    "seatingCapacity": 5,
    "transmission": "automatic",
    "fuelType": "hybrid",
    "mileageLimit": 350,
    "location": "Galle Fort Coastal Hub",
    "status": "available",
    "featuredImageUrl": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    "galleryImageUrls": [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
      
    ],
    "features": [
      "Toyota Synergy Hybrid (26 km/L)",
      "EV Mode Quiet Driving",
      "Pre-Crash Safety System",
      "Smart Keyless Entry",
      "Bluetooth Audio"
    ],
    "description": "Ultra-fuel-efficient hybrid technology. Whisper quiet at low speeds in city congestion, with world-renowned Toyota durability for cost-effective island tours.",
    "insuranceFeePerDay": 1500,
    "depositAmount": 25000,
    "createdAt": "2026-10-14T07:24:44.951Z",
    "updatedAt": "2026-10-14T07:24:44.951Z"
  }
];
