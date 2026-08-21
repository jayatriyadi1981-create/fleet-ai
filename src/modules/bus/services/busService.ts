/**
 * Fleet Intelligence Smart AI - Bus Management System Service (PO Bus & Passenger Fleet)
 * Native Enterprise Service with Multi-Tenant & Full Operational Lifecycle
 */

import {
  BusTrip,
  BusTicket,
  BusCargoPackage,
  BusAgentCounter,
  BusCrew,
  BusRampCheck,
  BusCharterBooking,
  BusFleetKPIs,
  BusSeat,
  BusStopLocation,
  BusVehicle,
  BusRoute,
  BusTerminal,
  BusDepot,
  BusPassenger,
  BusBooking,
  BusPassengerComplaint,
  BusEmergencyAlert
} from '../types';

class BusService {
  private buses: BusVehicle[] = [];
  private routes: BusRoute[] = [];
  private trips: BusTrip[] = [];
  private tickets: BusTicket[] = [];
  private passengers: BusPassenger[] = [];
  private bookings: BusBooking[] = [];
  private cargoPackages: BusCargoPackage[] = [];
  private agents: BusAgentCounter[] = [];
  private crews: BusCrew[] = [];
  private rampChecks: BusRampCheck[] = [];
  private charterBookings: BusCharterBooking[] = [];
  private terminals: BusTerminal[] = [];
  private depots: BusDepot[] = [];
  private complaints: BusPassengerComplaint[] = [];
  private emergencyAlerts: BusEmergencyAlert[] = [];

  constructor() {
    this.seedInitialData();
  }

  public generateSeatMap(busClass: string, totalSeats: number): BusSeat[] {
    const seats: BusSeat[] = [];
    const isSleeper = busClass === 'SLEEPER_SUITES';
    const isDoubleDecker = busClass === 'FIRST_CLASS_DOUBLE_DECKER';

    if (isSleeper) {
      // 22 Sleeper Pods (1-1 configuration)
      for (let i = 1; i <= 22; i++) {
        const deck = i <= 11 ? 'LOWER' : 'UPPER';
        const isOccupied = i <= 18;
        seats.push({
          seatNumber: `S-${i < 10 ? '0' + i : i}`,
          deck: deck,
          row: Math.ceil((i > 11 ? i - 11 : i) / 2),
          column: (i % 2 === 1) ? 1 : 2,
          type: 'SLEEPER',
          position: (i % 2 === 1) ? 'WINDOW' : 'AISLE',
          status: isOccupied ? 'OCCUPIED' : 'AVAILABLE',
          passengerName: isOccupied ? `Penumpang ${i}` : undefined,
          passengerGender: i % 2 === 0 ? 'MALE' : 'FEMALE'
        });
      }
    } else if (isDoubleDecker) {
      // Lower deck 6 Sleeper/First class, Upper deck 30 Executive
      for (let i = 1; i <= 6; i++) {
        const isOccupied = i <= 5;
        seats.push({
          seatNumber: `L-${i}`,
          deck: 'LOWER',
          row: Math.ceil(i / 2),
          column: (i % 2 === 1) ? 1 : 2,
          type: 'SLEEPER',
          position: (i % 2 === 1) ? 'WINDOW' : 'AISLE',
          status: isOccupied ? 'OCCUPIED' : 'AVAILABLE',
          passengerName: isOccupied ? `VIP Penumpang ${i}` : undefined
        });
      }
      for (let i = 1; i <= 30; i++) {
        const row = Math.ceil(i / 4);
        const col = ((i - 1) % 4) + 1;
        const isOccupied = i <= 24;
        seats.push({
          seatNumber: `U-${i < 10 ? '0' + i : i}`,
          deck: 'UPPER',
          row: row,
          column: col,
          type: 'RECLINING_MASSAGE',
          position: (col === 1 || col === 4) ? 'WINDOW' : 'AISLE',
          status: isOccupied ? 'OCCUPIED' : 'AVAILABLE',
          passengerName: isOccupied ? `Penumpang Eksekutif ${i}` : undefined
        });
      }
    } else {
      // Standard Executive (2-2 configuration, 32 or 36 seats)
      for (let i = 1; i <= totalSeats; i++) {
        const row = Math.ceil(i / 4);
        const col = ((i - 1) % 4) + 1;
        const isOccupied = i <= Math.floor(totalSeats * 0.85);
        seats.push({
          seatNumber: `${row}${String.fromCharCode(64 + col)}`,
          deck: 'SINGLE',
          row: row,
          column: col,
          type: 'LEG_REST',
          position: (col === 1 || col === 4) ? 'WINDOW' : 'AISLE',
          status: isOccupied ? 'OCCUPIED' : 'AVAILABLE',
          passengerName: isOccupied ? `Penumpang ${row}${String.fromCharCode(64 + col)}` : undefined
        });
      }
    }

    return seats;
  }

  private seedInitialData() {
    // 1. Bus Vehicles Fleet
    this.buses = [
      {
        id: 'bus-01',
        plateNumber: 'B 7102 SGA',
        busNumber: 'BUS-044',
        name: 'Avante H8 Suites Class #02',
        busType: 'INTERCITY_BUS',
        busClass: 'SLEEPER_SUITES',
        serviceType: 'AKAP',
        brand: 'Mercedes-Benz',
        model: 'OH 1626 Air Suspension Euro 4',
        chassisType: 'Mercedes-Benz OH 1626 / Automatic',
        bodyMaker: 'Tentrem Bodybuilder Malang',
        manufacturingYear: 2024,
        seatCapacity: 22,
        standingCapacity: 0,
        totalPassengerCapacity: 22,
        doorCount: 2,
        hasAC: true,
        hasToilet: true,
        hasWiFi: true,
        hasUsbCharger: true,
        hasEntertainment: true,
        hasCCTV: true,
        hasGPS: true,
        hasEmergencyEquipment: true,
        hasWheelchairAccessibility: false,
        status: 'ON_TRIP',
        currentLocationName: 'Tol Trans-Jawa KM 208 Cirebon - Brebes',
        currentCoordinates: { lat: -6.8214, lng: 108.7901 },
        currentSpeedKmH: 88,
        currentDriverId: 'crew-01',
        currentDriverName: 'Sutrisno (Pak Tris)',
        currentTripId: 'trip-01',
        currentTripCode: 'SJ-702-TRANS-JAWA',
        odometerKm: 84210,
        fuelLevelPct: 78,
        lastInspectionDate: '2026-08-18',
        nextInspectionDue: '2026-09-18',
        lastServiceDate: '2026-08-10',
        nextServiceKm: 90000,
        stnkExpiry: '2027-05-14',
        kirExpiry: '2026-11-20',
        kpsExpiry: '2028-01-10'
      },
      {
        id: 'bus-02',
        plateNumber: 'AD 1455 GA',
        busNumber: 'BUS-118',
        name: 'Jetbus 5 Super Double Decker #118',
        busType: 'DOUBLE_DECKER',
        busClass: 'FIRST_CLASS_DOUBLE_DECKER',
        serviceType: 'AKAP',
        brand: 'Scania',
        model: 'K410IB 6x2 Opticruise',
        chassisType: 'Scania K410IB Triple Axle',
        bodyMaker: 'Adiputro Wirasejati Malang',
        manufacturingYear: 2025,
        seatCapacity: 36,
        standingCapacity: 0,
        totalPassengerCapacity: 36,
        doorCount: 2,
        hasAC: true,
        hasToilet: true,
        hasWiFi: true,
        hasUsbCharger: true,
        hasEntertainment: true,
        hasCCTV: true,
        hasGPS: true,
        hasEmergencyEquipment: true,
        hasWheelchairAccessibility: true,
        status: 'ON_TRIP',
        currentLocationName: 'Tol Cikampek Utama KM 70',
        currentCoordinates: { lat: -6.4421, lng: 107.4512 },
        currentSpeedKmH: 92,
        currentDriverId: 'crew-03',
        currentDriverName: 'Budi Santoso',
        currentTripId: 'trip-02',
        currentTripCode: 'RI-415-DD-SOLO',
        odometerKm: 52100,
        fuelLevelPct: 82,
        lastInspectionDate: '2026-08-19',
        nextInspectionDue: '2026-09-19',
        lastServiceDate: '2026-08-05',
        nextServiceKm: 60000,
        stnkExpiry: '2028-02-28',
        kirExpiry: '2026-12-15',
        kpsExpiry: '2028-06-30'
      },
      {
        id: 'bus-03',
        plateNumber: 'B 7991 SGA',
        busNumber: 'BUS-052',
        name: 'Legacy SR3 Suites Family #52',
        busType: 'INTERCITY_BUS',
        busClass: 'SUPER_EXECUTIVE',
        serviceType: 'AKAP',
        brand: 'Hino',
        model: 'RM 280 Air Suspension Space Frame',
        chassisType: 'Hino RM 280 ABS',
        bodyMaker: 'Laksana Karoseri Ungaran',
        manufacturingYear: 2024,
        seatCapacity: 28,
        standingCapacity: 0,
        totalPassengerCapacity: 28,
        doorCount: 2,
        hasAC: true,
        hasToilet: true,
        hasWiFi: true,
        hasUsbCharger: true,
        hasEntertainment: true,
        hasCCTV: true,
        hasGPS: true,
        hasEmergencyEquipment: true,
        hasWheelchairAccessibility: false,
        status: 'BOARDING',
        currentLocationName: 'Terminal Terpadu Pulo Gebang Jakarta',
        currentCoordinates: { lat: -6.213, lng: 106.953 },
        currentSpeedKmH: 0,
        currentDriverId: 'crew-05',
        currentDriverName: 'Bambang Kusuma',
        currentTripId: 'trip-03',
        currentTripCode: 'ML-901-EXC-MLG',
        odometerKm: 67300,
        fuelLevelPct: 95,
        lastInspectionDate: '2026-08-20',
        nextInspectionDue: '2026-09-20',
        lastServiceDate: '2026-08-12',
        nextServiceKm: 75000,
        stnkExpiry: '2027-09-10',
        kirExpiry: '2027-01-14',
        kpsExpiry: '2028-04-12'
      },
      {
        id: 'bus-04',
        plateNumber: 'B 7800 SGA',
        busNumber: 'BUS-088',
        name: 'Jetbus 5 MHD Pariwisata Luxury',
        busType: 'TOUR_BUS',
        busClass: 'EXECUTIVE',
        serviceType: 'PARIWISATA',
        brand: 'Mercedes-Benz',
        model: 'OF 1623 Euro 4',
        chassisType: 'Mercedes-Benz OF 1623 Front Engine',
        bodyMaker: 'Adiputro Karoseri',
        manufacturingYear: 2024,
        seatCapacity: 50,
        standingCapacity: 0,
        totalPassengerCapacity: 50,
        doorCount: 2,
        hasAC: true,
        hasToilet: false,
        hasWiFi: true,
        hasUsbCharger: true,
        hasEntertainment: true,
        hasCCTV: true,
        hasGPS: true,
        hasEmergencyEquipment: true,
        hasWheelchairAccessibility: false,
        status: 'AVAILABLE',
        currentLocationName: 'Pool Pusat Cakung Barat Jakarta',
        currentCoordinates: { lat: -6.182, lng: 106.945 },
        currentSpeedKmH: 0,
        odometerKm: 34100,
        fuelLevelPct: 90,
        lastInspectionDate: '2026-08-17',
        nextInspectionDue: '2026-09-17',
        lastServiceDate: '2026-07-28',
        nextServiceKm: 40000,
        stnkExpiry: '2028-04-05',
        kirExpiry: '2027-02-18',
        kpsExpiry: '2028-09-01'
      },
      {
        id: 'bus-05',
        plateNumber: 'D 7721 AB',
        busNumber: 'BUS-BRT-01',
        name: 'CityLiner Low Floor BRT',
        busType: 'CITY_BUS',
        busClass: 'BUSINESS_AC',
        serviceType: 'BRT_CITY_BUS',
        brand: 'Volvo',
        model: 'B8RLE Low Entry 6x2',
        chassisType: 'Volvo B8RLE Euro 5',
        bodyMaker: 'Laksana Cityliner',
        manufacturingYear: 2023,
        seatCapacity: 35,
        standingCapacity: 40,
        totalPassengerCapacity: 75,
        doorCount: 3,
        hasAC: true,
        hasToilet: false,
        hasWiFi: true,
        hasUsbCharger: true,
        hasEntertainment: false,
        hasCCTV: true,
        hasGPS: true,
        hasEmergencyEquipment: true,
        hasWheelchairAccessibility: true,
        status: 'ON_TRIP',
        currentLocationName: 'Koridor 1 Blok M - Kota',
        currentCoordinates: { lat: -6.225, lng: 106.801 },
        currentSpeedKmH: 34,
        odometerKm: 112000,
        fuelLevelPct: 65,
        lastInspectionDate: '2026-08-15',
        nextInspectionDue: '2026-09-15',
        lastServiceDate: '2026-08-01',
        nextServiceKm: 120000,
        stnkExpiry: '2027-11-20',
        kirExpiry: '2026-10-30',
        kpsExpiry: '2028-08-10'
      }
    ];

    // 2. Bus Routes
    this.routes = [
      {
        id: 'rt-jkt-sby',
        routeCode: 'JKT-SBY-01',
        routeName: 'Jakarta (Pulo Gebang) ➔ Surabaya (Bungurasih) via Tol Trans-Jawa',
        originCity: 'Jakarta Timur',
        destinationCity: 'Surabaya',
        originTerminal: 'Terminal Terpadu Pulo Gebang',
        destinationTerminal: 'Terminal Purabaya Bungurasih',
        distanceKm: 785,
        estimatedDurationHours: 10.5,
        serviceType: 'AKAP',
        busClass: 'SLEEPER_SUITES',
        operatingDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
        baseFare: 480000,
        activeTripsCount: 4,
        routeEfficiencyScorePct: 96.4,
        stops: [
          {
            id: 'st-01',
            stopCode: 'STP-PLG',
            name: 'Terminal Terpadu Pulo Gebang',
            type: 'TERMINAL',
            city: 'Jakarta Timur',
            address: 'Jl. Raya Pulo Gebang, Cakung',
            coordinates: { lat: -6.213, lng: 106.953 },
            geofenceRadiusMeters: 300,
            operatingHours: '24 Jam',
            boardingAllowed: true,
            dropOffAllowed: true,
            stopSequence: 1,
            scheduledTime: '17:30'
          },
          {
            id: 'st-02',
            stopCode: 'STP-BKS',
            name: 'Pool Agen Bekasi Timur',
            type: 'AGEN_RESMI',
            city: 'Bekasi',
            address: 'Jl. Cut Meutia No. 12',
            coordinates: { lat: -6.255, lng: 107.009 },
            geofenceRadiusMeters: 150,
            operatingHours: '06:00 - 22:00',
            boardingAllowed: true,
            dropOffAllowed: false,
            stopSequence: 2,
            scheduledTime: '18:15'
          },
          {
            id: 'st-03',
            stopCode: 'STP-RA228',
            name: 'Rest Area KM 228A Tol Pejagan (RM Taman Sari)',
            type: 'REST_AREA_RM',
            city: 'Cirebon',
            address: 'Tol Kanci - Pejagan KM 228',
            coordinates: { lat: -6.842, lng: 108.821 },
            geofenceRadiusMeters: 250,
            operatingHours: '24 Jam',
            boardingAllowed: false,
            dropOffAllowed: false,
            stopSequence: 3,
            scheduledTime: '21:30',
            isRestAreaMeal: true
          },
          {
            id: 'st-04',
            stopCode: 'STP-TNG',
            name: 'Terminal Tingkir Salatiga',
            type: 'TERMINAL',
            city: 'Salatiga',
            address: 'Jl. Raya Tingkir',
            coordinates: { lat: -7.345, lng: 110.512 },
            geofenceRadiusMeters: 200,
            operatingHours: '24 Jam',
            boardingAllowed: true,
            dropOffAllowed: true,
            stopSequence: 4,
            scheduledTime: '02:00'
          },
          {
            id: 'st-05',
            stopCode: 'STP-SBY',
            name: 'Terminal Purabaya (Bungurasih)',
            type: 'TERMINAL',
            city: 'Surabaya',
            address: 'Waru, Sidoarjo',
            coordinates: { lat: -7.352, lng: 112.726 },
            geofenceRadiusMeters: 400,
            operatingHours: '24 Jam',
            boardingAllowed: true,
            dropOffAllowed: true,
            stopSequence: 5,
            scheduledTime: '05:30'
          }
        ]
      },
      {
        id: 'rt-tgr-slo',
        routeCode: 'TGR-SLO-02',
        routeName: 'Tangerang (Poris) ➔ Solo (Tirtonadi) - Madiun via Trans Jawa',
        originCity: 'Tangerang',
        destinationCity: 'Solo',
        originTerminal: 'Terminal Poris Plawad',
        destinationTerminal: 'Terminal Tirtonadi',
        distanceKm: 560,
        estimatedDurationHours: 8.0,
        serviceType: 'AKAP',
        busClass: 'FIRST_CLASS_DOUBLE_DECKER',
        operatingDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
        baseFare: 395000,
        activeTripsCount: 3,
        routeEfficiencyScorePct: 98.1,
        stops: []
      }
    ];

    // 3. Trips Data
    this.trips = [
      {
        id: 'trip-01',
        tripCode: 'SJ-702-TRANS-JAWA',
        routeId: 'rt-jkt-sby',
        routeName: 'Jakarta (Pulo Gebang) ➔ Surabaya (Bungurasih)',
        serviceType: 'AKAP',
        busClass: 'SLEEPER_SUITES',
        busId: 'bus-01',
        busPlateNumber: 'B 7102 SGA',
        busName: 'Avante H8 Suites Class #02',
        chassisType: 'Mercedes-Benz OH 1626 Air Suspension',
        bodyMaker: 'Tentrem Bodybuilder',
        departureTerminal: 'Terminal Terpadu Pulo Gebang, Jakarta',
        arrivalTerminal: 'Terminal Purabaya Bungurasih, Surabaya',
        departureDate: '2026-08-20',
        departureTime: '17:30',
        estimatedArrivalTime: '2026-08-21 05:30',
        actualDepartureTime: '2026-08-20 17:35',
        status: 'IN_TRANSIT',
        currentLocationName: 'Tol Trans-Jawa KM 208 Cirebon - Brebes',
        currentCoordinates: { lat: -6.8214, lng: 108.7901 },
        currentSpeedKmH: 88,
        delayMinutes: 5,
        totalSeats: 22,
        bookedSeats: 21,
        boardedCount: 20,
        ticketPrice: 480000,
        primaryDriverId: 'crew-01',
        primaryDriverName: 'Sutrisno (Pak Tris)',
        primaryDriverPhone: '0812-7788-9901',
        secondaryDriverId: 'crew-02',
        secondaryDriverName: 'Haryanto Wibowo',
        conductorId: 'crew-06',
        conductorName: 'Dimas Aditya',
        hostessName: 'Tiara Safitri',
        ujsAmount: 3200000,
        allocatedFuelLiters: 260,
        actualFuelConsumedLiters: 110,
        tollCardBalance: 1850000,
        estimatedMealAllowance: 550000,
        stops: this.routes[0].stops,
        seatMap: this.generateSeatMap('SLEEPER_SUITES', 22)
      },
      {
        id: 'trip-02',
        tripCode: 'RI-415-DD-SOLO',
        routeId: 'rt-tgr-slo',
        routeName: 'Tangerang (Poris) ➔ Solo (Tirtonadi) - Madiun',
        serviceType: 'AKAP',
        busClass: 'FIRST_CLASS_DOUBLE_DECKER',
        busId: 'bus-02',
        busPlateNumber: 'AD 1455 GA',
        busName: 'Jetbus 5 Super Double Decker #118',
        chassisType: 'Scania K410IB Opticruise 6x2',
        bodyMaker: 'Adiputro Wirasejati',
        departureTerminal: 'Terminal Poris Plawad, Tangerang',
        arrivalTerminal: 'Terminal Tirtonadi, Surakarta (Solo)',
        departureDate: '2026-08-20',
        departureTime: '18:00',
        estimatedArrivalTime: '2026-08-21 04:00',
        actualDepartureTime: '2026-08-20 18:00',
        status: 'IN_TRANSIT',
        currentLocationName: 'Tol Cikampek Utama KM 70',
        currentCoordinates: { lat: -6.4421, lng: 107.4512 },
        currentSpeedKmH: 92,
        delayMinutes: 0,
        totalSeats: 36,
        bookedSeats: 35,
        boardedCount: 35,
        ticketPrice: 395000,
        primaryDriverId: 'crew-03',
        primaryDriverName: 'Budi Santoso',
        primaryDriverPhone: '0813-9900-1122',
        secondaryDriverId: 'crew-04',
        secondaryDriverName: 'Joko Widodo (Kapt. Joko)',
        conductorId: 'crew-07',
        conductorName: 'Rahmat Hidayat',
        hostessName: 'Nadia Anggraini',
        ujsAmount: 2850000,
        allocatedFuelLiters: 290,
        actualFuelConsumedLiters: 80,
        tollCardBalance: 1600000,
        estimatedMealAllowance: 720000,
        stops: [],
        seatMap: this.generateSeatMap('FIRST_CLASS_DOUBLE_DECKER', 36)
      },
      {
        id: 'trip-03',
        tripCode: 'ML-901-EXC-MLG',
        routeId: 'rt-jkt-mlg',
        routeName: 'Jakarta (Kampung Rambutan) ➔ Malang (Arjosari)',
        serviceType: 'AKAP',
        busClass: 'SUPER_EXECUTIVE',
        busId: 'bus-03',
        busPlateNumber: 'B 7991 SGA',
        busName: 'Legacy SR3 Suites Family #52',
        chassisType: 'Hino RM 280 Space Frame',
        bodyMaker: 'Laksana Karoseri',
        departureTerminal: 'Terminal Kampung Rambutan, Jakarta',
        arrivalTerminal: 'Terminal Arjosari, Malang',
        departureDate: '2026-08-20',
        departureTime: '19:00',
        estimatedArrivalTime: '2026-08-21 07:30',
        status: 'BOARDING',
        currentLocationName: 'Terminal Terpadu Pulo Gebang (Jalur Keberangkatan)',
        currentCoordinates: { lat: -6.213, lng: 106.953 },
        currentSpeedKmH: 0,
        delayMinutes: 0,
        totalSeats: 28,
        bookedSeats: 26,
        boardedCount: 18,
        ticketPrice: 420000,
        primaryDriverId: 'crew-05',
        primaryDriverName: 'Bambang Kusuma',
        primaryDriverPhone: '0812-4455-6677',
        secondaryDriverName: 'Eko Prasetyo',
        conductorName: 'Agus Salim',
        ujsAmount: 3400000,
        allocatedFuelLiters: 275,
        tollCardBalance: 1900000,
        estimatedMealAllowance: 560000,
        stops: [],
        seatMap: this.generateSeatMap('SUPER_EXECUTIVE', 28)
      }
    ];

    // 4. Tickets Data
    this.tickets = [
      {
        id: 'tkt-01',
        ticketNumber: 'TKT-20260820-9921',
        tripId: 'trip-01',
        tripCode: 'SJ-702-TRANS-JAWA',
        routeName: 'Jakarta ➔ Surabaya',
        busClass: 'SLEEPER_SUITES',
        busPlateNumber: 'B 7102 SGA',
        departureDate: '2026-08-20',
        departureTime: '17:30',
        seatNumber: 'S-01',
        passengerName: 'Ananda Bagus Pratama',
        passengerPhone: '0812-8877-6655',
        passengerIdNumber: '3174092205940001',
        passengerGender: 'MALE',
        boardingPoint: 'Terminal Terpadu Pulo Gebang',
        dropPoint: 'Terminal Purabaya (Bungurasih)',
        baseFare: 480000,
        insuranceFee: 5000,
        serviceFee: 5000,
        totalFare: 490000,
        paymentMethod: 'ONLINE_QRIS',
        paymentStatus: 'PAID',
        status: 'BOARDED',
        qrCodeData: 'BUS-QR:TKT-20260820-9921:SJ-702:S-01',
        baggageWeightKg: 14,
        baggageTagNumber: 'BAG-SJ-8890',
        mealCouponClaimed: true,
        bookedAt: '2026-08-19 14:22',
        boardedAt: '2026-08-20 17:15',
        boardedLocation: 'Gate 4 Terminal Pulo Gebang',
        checkedByCrewName: 'Dimas Aditya'
      },
      {
        id: 'tkt-02',
        ticketNumber: 'TKT-20260820-9922',
        tripId: 'trip-01',
        tripCode: 'SJ-702-TRANS-JAWA',
        routeName: 'Jakarta ➔ Surabaya',
        busClass: 'SLEEPER_SUITES',
        busPlateNumber: 'B 7102 SGA',
        departureDate: '2026-08-20',
        departureTime: '17:30',
        seatNumber: 'S-02',
        passengerName: 'Dra. Siti Rahmawati',
        passengerPhone: '0813-1122-3344',
        passengerIdNumber: '3175026608750003',
        passengerGender: 'FEMALE',
        boardingPoint: 'Terminal Terpadu Pulo Gebang',
        dropPoint: 'Terminal Purabaya (Bungurasih)',
        baseFare: 480000,
        insuranceFee: 5000,
        serviceFee: 5000,
        totalFare: 490000,
        paymentMethod: 'TRANSFER_VA',
        paymentStatus: 'PAID',
        status: 'BOARDED',
        qrCodeData: 'BUS-QR:TKT-20260820-9922:SJ-702:S-02',
        baggageWeightKg: 18,
        baggageTagNumber: 'BAG-SJ-8891',
        mealCouponClaimed: true,
        bookedAt: '2026-08-18 09:10',
        boardedAt: '2026-08-20 17:20',
        boardedLocation: 'Gate 4 Terminal Pulo Gebang',
        checkedByCrewName: 'Dimas Aditya'
      },
      {
        id: 'tkt-03',
        ticketNumber: 'TKT-20260820-9923',
        tripId: 'trip-01',
        tripCode: 'SJ-702-TRANS-JAWA',
        routeName: 'Jakarta ➔ Surabaya',
        busClass: 'SLEEPER_SUITES',
        busPlateNumber: 'B 7102 SGA',
        departureDate: '2026-08-20',
        departureTime: '17:30',
        seatNumber: 'S-03',
        passengerName: 'Hendro Gunawan',
        passengerPhone: '0818-5544-3322',
        passengerIdNumber: '3275011904880002',
        passengerGender: 'MALE',
        boardingPoint: 'Pool Agen Bekasi Timur',
        dropPoint: 'Terminal Purabaya (Bungurasih)',
        baseFare: 480000,
        insuranceFee: 5000,
        serviceFee: 5000,
        totalFare: 490000,
        paymentMethod: 'AGENT_CASH',
        paymentStatus: 'PAID',
        status: 'BOARDED',
        qrCodeData: 'BUS-QR:TKT-20260820-9923:SJ-702:S-03',
        baggageWeightKg: 10,
        baggageTagNumber: 'BAG-SJ-8892',
        mealCouponClaimed: false,
        bookedAt: '2026-08-20 11:30',
        boardedAt: '2026-08-20 18:25',
        boardedLocation: 'Pool Agen Bekasi Timur',
        checkedByCrewName: 'Dimas Aditya'
      },
      {
        id: 'tkt-04',
        ticketNumber: 'TKT-20260820-9924',
        tripId: 'trip-01',
        tripCode: 'SJ-702-TRANS-JAWA',
        routeName: 'Jakarta ➔ Surabaya',
        busClass: 'SLEEPER_SUITES',
        busPlateNumber: 'B 7102 SGA',
        departureDate: '2026-08-20',
        departureTime: '17:30',
        seatNumber: 'S-04',
        passengerName: 'Nurul Hidayah',
        passengerPhone: '0812-9988-7766',
        passengerIdNumber: '3174095509920005',
        passengerGender: 'FEMALE',
        boardingPoint: 'Terminal Terpadu Pulo Gebang',
        dropPoint: 'Terminal Tingkir Salatiga',
        baseFare: 380000,
        insuranceFee: 5000,
        serviceFee: 5000,
        totalFare: 390000,
        paymentMethod: 'OTA_TIKETING',
        paymentStatus: 'PAID',
        status: 'BOARDED',
        qrCodeData: 'BUS-QR:TKT-20260820-9924:SJ-702:S-04',
        baggageWeightKg: 8,
        mealCouponClaimed: false,
        bookedAt: '2026-08-19 20:00'
      }
    ];

    // 5. Passengers Data
    this.passengers = [
      {
        id: 'psg-01',
        name: 'Ananda Bagus Pratama',
        phone: '0812-8877-6655',
        email: 'ananda.bagus@gmail.com',
        idCardNumber: '3174092205940001',
        gender: 'MALE',
        emergencyContact: '0812-8877-9999 (Istri)',
        totalTripsCount: 14,
        membershipTier: 'VIP_EXECUTIVE',
        loyaltyPoints: 3450,
        recentTrips: [
          { tripCode: 'SJ-702-TRANS-JAWA', date: '2026-08-20', route: 'Jakarta - Surabaya', seat: 'S-01' },
          { tripCode: 'SJ-512-JKT-SBY', date: '2026-07-28', route: 'Surabaya - Jakarta', seat: 'S-02' }
        ]
      },
      {
        id: 'psg-02',
        name: 'Dra. Siti Rahmawati',
        phone: '0813-1122-3344',
        email: 'siti.rahma@kemdikbud.go.id',
        idCardNumber: '3175026608750003',
        gender: 'FEMALE',
        emergencyContact: '0813-1122-8888 (Anak)',
        totalTripsCount: 8,
        membershipTier: 'GOLD',
        loyaltyPoints: 1820,
        recentTrips: [
          { tripCode: 'SJ-702-TRANS-JAWA', date: '2026-08-20', route: 'Jakarta - Surabaya', seat: 'S-02' }
        ]
      }
    ];

    // 6. Bookings Data
    this.bookings = [
      {
        id: 'bkg-01',
        bookingCode: 'BKG-20260820-001',
        passengerId: 'psg-01',
        passengerName: 'Ananda Bagus Pratama',
        passengerPhone: '0812-8877-6655',
        passengerEmail: 'ananda.bagus@gmail.com',
        tripId: 'trip-01',
        tripCode: 'SJ-702-TRANS-JAWA',
        routeName: 'Jakarta ➔ Surabaya',
        busPlateNumber: 'B 7102 SGA',
        seatNumbers: ['S-01'],
        seatCount: 1,
        pickupStop: 'Terminal Terpadu Pulo Gebang',
        dropoffStop: 'Terminal Purabaya (Bungurasih)',
        bookingType: 'INDIVIDUAL',
        totalFare: 490000,
        discountAmount: 0,
        finalPaidAmount: 490000,
        paymentStatus: 'PAID',
        bookingStatus: 'BOARDED',
        bookedAt: '2026-08-19 14:22'
      }
    ];

    // 7. Crew & Driver Roster
    this.crews = [
      {
        id: 'crew-01',
        crewNumber: 'DRV-001',
        name: 'Sutrisno (Pak Tris)',
        role: 'PRIMARY_DRIVER',
        phone: '0812-7788-9901',
        simType: 'SIM_B2_UMUM',
        simExpiryDate: '2028-09-12',
        status: 'ACTIVE_DRIVING',
        totalContinuousDrivingHours: 3.2,
        dailyDrivingHours: 5.5,
        restHoursRemaining: 8.5,
        totalWeeklyTrips: 4,
        safetyScore: 98,
        fatigueScore: 18,
        currentAssignedTrip: 'SJ-702-TRANS-JAWA',
        currentAssignedBusPlate: 'B 7102 SGA'
      },
      {
        id: 'crew-02',
        crewNumber: 'DRV-002',
        name: 'Haryanto Wibowo',
        role: 'SECONDARY_DRIVER',
        phone: '0812-3344-5566',
        simType: 'SIM_B2_UMUM',
        simExpiryDate: '2027-11-04',
        status: 'RESTING',
        totalContinuousDrivingHours: 0,
        dailyDrivingHours: 2.0,
        restHoursRemaining: 10.0,
        totalWeeklyTrips: 3,
        safetyScore: 96,
        fatigueScore: 10,
        currentAssignedTrip: 'SJ-702-TRANS-JAWA',
        currentAssignedBusPlate: 'B 7102 SGA'
      },
      {
        id: 'crew-03',
        crewNumber: 'DRV-003',
        name: 'Budi Santoso',
        role: 'PRIMARY_DRIVER',
        phone: '0813-9900-1122',
        simType: 'SIM_B2_UMUM',
        simExpiryDate: '2028-01-20',
        status: 'ACTIVE_DRIVING',
        totalContinuousDrivingHours: 2.1,
        dailyDrivingHours: 4.2,
        restHoursRemaining: 9.8,
        totalWeeklyTrips: 4,
        safetyScore: 97,
        fatigueScore: 22,
        currentAssignedTrip: 'RI-415-DD-SOLO',
        currentAssignedBusPlate: 'AD 1455 GA'
      },
      {
        id: 'crew-05',
        crewNumber: 'DRV-005',
        name: 'Bambang Kusuma',
        role: 'PRIMARY_DRIVER',
        phone: '0812-4455-6677',
        simType: 'SIM_B2_UMUM',
        simExpiryDate: '2027-08-30',
        status: 'RESTING',
        totalContinuousDrivingHours: 0,
        dailyDrivingHours: 0,
        restHoursRemaining: 12.0,
        totalWeeklyTrips: 2,
        safetyScore: 99,
        fatigueScore: 5,
        currentAssignedTrip: 'ML-901-EXC-MLG',
        currentAssignedBusPlate: 'B 7991 SGA'
      }
    ];

    // 8. Terminals
    this.terminals = [
      {
        id: 'trm-01',
        name: 'Terminal Terpadu Pulo Gebang',
        terminalType: 'TIPE_A',
        city: 'Jakarta Timur',
        address: 'Jl. Raya Pulo Gebang, Cakung, Jakarta Timur',
        coordinates: { lat: -6.213, lng: 106.953 },
        capacityBuses: 120,
        operatingHours: '24 Jam',
        platforms: [
          { platformNumber: 'Gate 01', routeDestinations: ['Bandung', 'Garut', 'Tasikmalaya'] },
          { platformNumber: 'Gate 04', routeDestinations: ['Surabaya', 'Malang', 'Solo'], currentBusPlate: 'B 7102 SGA', departureTime: '17:30' },
          { platformNumber: 'Gate 08', routeDestinations: ['Yogyakarta', 'Purwokerto', 'Semarang'] }
        ],
        facilities: ['AC Lounge', 'Ruang Laktasi', 'Musholla 2 Lantai', 'Food Court', 'E-Ticketing Kiosk', 'Charging Station'],
        activeRoutesCount: 18
      },
      {
        id: 'trm-02',
        name: 'Terminal Purabaya (Bungurasih)',
        terminalType: 'TIPE_A',
        city: 'Surabaya / Sidoarjo',
        address: 'Jl. Letjen Sutoyo, Bungurasih, Waru, Sidoarjo',
        coordinates: { lat: -7.352, lng: 112.726 },
        capacityBuses: 150,
        operatingHours: '24 Jam',
        platforms: [
          { platformNumber: 'Jalur 1', routeDestinations: ['Jakarta', 'Tangerang', 'Bogor'] },
          { platformNumber: 'Jalur 3', routeDestinations: ['Denpasar Bali', 'Mataram Lombok'] }
        ],
        facilities: ['Kemenhub Inspection Bay', 'Ruang Tunggu VIP', 'Restoran 24 Jam'],
        activeRoutesCount: 24
      }
    ];

    // 9. Depots / Pools
    this.depots = [
      {
        id: 'depot-01',
        name: 'Pool Pusat & Workshop Cakung',
        code: 'DEP-CKG-01',
        city: 'Jakarta Timur',
        address: 'Kawasan Industri Pulogadung / Cakung Barat',
        coordinates: { lat: -6.182, lng: 106.945 },
        totalParkingCapacity: 45,
        maintenanceBaysCount: 8,
        hasFuelFacility: true,
        fuelStockLiters: 48000,
        managerName: 'H. Suryadi Martono',
        contactPhone: '0812-9900-8811',
        busesParkedCount: 12,
        busesMaintenanceCount: 2
      },
      {
        id: 'depot-02',
        name: 'Pool Cabang Solo Karanganyar',
        code: 'DEP-SLO-02',
        city: 'Karanganyar / Surakarta',
        address: 'Jl. Raya Palur No. 88, Karanganyar',
        coordinates: { lat: -7.562, lng: 110.865 },
        totalParkingCapacity: 30,
        maintenanceBaysCount: 4,
        hasFuelFacility: true,
        fuelStockLiters: 24000,
        managerName: 'Kusworo Nugroho',
        contactPhone: '0813-8877-6655',
        busesParkedCount: 8,
        busesMaintenanceCount: 1
      }
    ];

    // 10. Passenger Complaints
    this.complaints = [
      {
        id: 'cmp-01',
        complaintNumber: 'CMP-2026-0819-01',
        category: 'BUS',
        passengerName: 'Rudi Hermawan',
        passengerPhone: '0812-7766-5544',
        tripCode: 'SJ-702-TRANS-JAWA',
        busPlateNumber: 'B 7102 SGA',
        description: 'Suhu AC pada kursi S-14 terasa agak dingin berlebih saat melintas tol Cipali pada malam hari.',
        severity: 'LOW',
        status: 'RESOLVED',
        resolutionNotes: 'Hostess Tiara telah menyediakan selimut tambahan dan kru menyetel thermostat ke 23°C.',
        createdAt: '2026-08-19 22:30',
        resolvedAt: '2026-08-19 22:45'
      }
    ];

    // 11. Ramp Checks
    this.rampChecks = [
      {
        id: 'rc-01',
        checkDate: '2026-08-20',
        busPlateNumber: 'B 7102 SGA',
        inspectorName: 'Ir. Hendra Setiawan (BPTD Kelas II Jabar Kemenhub)',
        poolLocation: 'Terminal Terpadu Pulo Gebang',
        brakeSystemPass: true,
        tireConditionPass: true,
        wiperLightingPass: true,
        emergencyHammerCount: 6,
        fireExtinguisherAparPass: true,
        emergencyExitPass: true,
        seatBeltDriverPass: true,
        speedometerGpsPass: true,
        kirKpsValidityPass: true,
        acSystemPass: true,
        cctvPass: true,
        overallStatus: 'PASSED_READY',
        notes: 'Seluruh sistem keselamatan kemudi, rem angin ganda, dan palu darurat lengkap berfungsi sempurna.',
        inspectorSignature: 'Hendra Setiawan - NIP. 197804152003121002',
        driverSignature: 'Sutrisno',
        nextInspectionDue: '2026-09-20'
      }
    ];
  }

  // Getters
  getBuses(): BusVehicle[] {
    return [...this.buses];
  }

  getBusById(id: string): BusVehicle | undefined {
    return this.buses.find(b => b.id === id || b.plateNumber === id || b.busNumber === id);
  }

  getRoutes(): BusRoute[] {
    return [...this.routes];
  }

  getTrips(): BusTrip[] {
    return [...this.trips];
  }

  getTickets(): BusTicket[] {
    return [...this.tickets];
  }

  getPassengers(): BusPassenger[] {
    return [...this.passengers];
  }

  getBookings(): BusBooking[] {
    return [...this.bookings];
  }

  getCargoPackages(): BusCargoPackage[] {
    return [...this.cargoPackages];
  }

  getAgents(): BusAgentCounter[] {
    return [...this.agents];
  }

  getCrews(): BusCrew[] {
    return [...this.crews];
  }

  getRampChecks(): BusRampCheck[] {
    return [...this.rampChecks];
  }

  getCharterBookings(): BusCharterBooking[] {
    return [...this.charterBookings];
  }

  getTerminals(): BusTerminal[] {
    return [...this.terminals];
  }

  getDepots(): BusDepot[] {
    return [...this.depots];
  }

  getComplaints(): BusPassengerComplaint[] {
    return [...this.complaints];
  }

  getEmergencyAlerts(): BusEmergencyAlert[] {
    return [...this.emergencyAlerts];
  }

  getKPIs(): BusFleetKPIs {
    const totalDailyTicketRevenue = this.tickets.reduce((sum, t) => sum + t.totalFare, 0) + 14200000;
    const totalDailyCargoRevenue = 3850000;
    const totalDailyCharterRevenue = 28000000;

    return {
      totalActiveBuses: this.buses.length,
      busesEnRoute: this.buses.filter(b => b.status === 'ON_TRIP').length,
      busesInPool: this.buses.filter(b => b.status === 'AVAILABLE' || b.status === 'SCHEDULED').length,
      busesInMaintenance: this.buses.filter(b => b.status === 'MAINTENANCE').length,
      
      dailyDepartures: this.trips.length + 8,
      dailyPassengersCarried: 342,
      averageOccupancyRatePct: 91.8,
      onTimePerformancePct: 95.4,
      
      totalDailyTicketRevenue: totalDailyTicketRevenue,
      totalDailyCargoRevenue: totalDailyCargoRevenue,
      totalDailyCharterRevenue: totalDailyCharterRevenue,
      totalMonthlyRevenue: (totalDailyTicketRevenue + totalDailyCargoRevenue) * 30 + 120000000,
      
      dailyFuelCost: 8400000,
      dailyMaintenanceCost: 2200000,
      dailyTollCost: 4100000,
      dailyDriverUjsCost: 6500000,
      
      costPerKm: 6420,
      revenuePerKm: 11850,
      averageFuelConsumptionKmPerLiter: 3.65,
      safetyComplianceRatePct: 99.4,
      driverRiskScoreAvg: 14.2,
      busRiskScoreAvg: 8.5
    };
  }

  // Conflict & Collision Detection for Dispatcher
  validateBusAndDriverAssignment(
    busId: string,
    driverId: string,
    tripDate: string,
    departureTime: string,
    tripIdToExclude?: string
  ): { valid: boolean; conflictReason?: string } {
    // Check if bus is already assigned to an active or scheduled trip on the same date/time window
    const conflictingBusTrip = this.trips.find(t => 
      t.id !== tripIdToExclude &&
      t.busId === busId &&
      t.departureDate === tripDate &&
      t.status !== 'COMPLETED' &&
      t.status !== 'CANCELLED'
    );

    if (conflictingBusTrip) {
      return {
        valid: false,
        conflictReason: `Bus ${conflictingBusTrip.busPlateNumber} telah ditugaskan pada trip ${conflictingBusTrip.tripCode} jam ${conflictingBusTrip.departureTime}.`
      };
    }

    // Check driver fatigue and active shift
    const driver = this.crews.find(c => c.id === driverId);
    if (driver) {
      if (driver.fatigueScore > 70) {
        return {
          valid: false,
          conflictReason: `Supir ${driver.name} memiliki tingkat kelelahan (Fatigue Score: ${driver.fatigueScore}) yang kritis. Wajib istirahat min. 8 jam.`
        };
      }

      if (driver.dailyDrivingHours >= 8) {
        return {
          valid: false,
          conflictReason: `Supir ${driver.name} telah mencapai batas regulasi 8 jam mengemudi harian.`
        };
      }
    }

    return { valid: true };
  }

  // Operations: Trip, Ticket, QR Boarding
  createTrip(tripData: Partial<BusTrip>): BusTrip {
    const newTrip: BusTrip = {
      id: `trip-${Date.now()}`,
      tripCode: tripData.tripCode || `TRP-${Math.floor(100 + Math.random() * 900)}`,
      routeId: tripData.routeId || 'rt-general',
      routeName: tripData.routeName || 'Jakarta ➔ Surabaya',
      serviceType: tripData.serviceType || 'AKAP',
      busClass: tripData.busClass || 'EXECUTIVE',
      busId: tripData.busId || 'bus-generic',
      busPlateNumber: tripData.busPlateNumber || 'B 7999 TGA',
      busName: tripData.busName || 'Jetbus 5 Eksekutif',
      chassisType: tripData.chassisType || 'Mercedes-Benz OH 1626',
      bodyMaker: tripData.bodyMaker || 'Adiputro Karoseri',
      departureTerminal: tripData.departureTerminal || 'Terminal Terpadu Pulo Gebang',
      arrivalTerminal: tripData.arrivalTerminal || 'Terminal Purabaya Bungurasih',
      departureDate: tripData.departureDate || new Date().toISOString().split('T')[0],
      departureTime: tripData.departureTime || '18:00',
      estimatedArrivalTime: tripData.estimatedArrivalTime || '2026-08-21 06:00',
      status: tripData.status || 'PLANNED',
      delayMinutes: 0,
      totalSeats: tripData.totalSeats || 32,
      bookedSeats: tripData.bookedSeats || 0,
      boardedCount: 0,
      ticketPrice: tripData.ticketPrice || 350000,
      primaryDriverName: tripData.primaryDriverName || 'Supir Utama',
      primaryDriverPhone: tripData.primaryDriverPhone || '081200000000',
      secondaryDriverName: tripData.secondaryDriverName || 'Supir Cadangan',
      conductorName: tripData.conductorName || 'Kondektur Bus',
      ujsAmount: tripData.ujsAmount || 2500000,
      allocatedFuelLiters: tripData.allocatedFuelLiters || 240,
      tollCardBalance: tripData.tollCardBalance || 1200000,
      estimatedMealAllowance: tripData.estimatedMealAllowance || 400000,
      stops: tripData.stops || [],
      seatMap: this.generateSeatMap(tripData.busClass || 'EXECUTIVE', tripData.totalSeats || 32)
    };

    this.trips.unshift(newTrip);
    return newTrip;
  }

  bookTicket(ticketData: Partial<BusTicket>): BusTicket {
    const trip = this.trips.find(t => t.id === ticketData.tripId) || this.trips[0];
    const ticketNo = `TKT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: BusTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: ticketNo,
      tripId: trip?.id || 'trip-01',
      tripCode: trip?.tripCode || 'SJ-702-TRANS-JAWA',
      routeName: trip?.routeName || 'Jakarta ➔ Surabaya',
      busClass: trip?.busClass || 'SLEEPER_SUITES',
      busPlateNumber: trip?.busPlateNumber || 'B 7102 SGA',
      departureDate: trip?.departureDate || new Date().toISOString().split('T')[0],
      departureTime: trip?.departureTime || '17:30',
      seatNumber: ticketData.seatNumber || 'S-05',
      passengerName: ticketData.passengerName || 'Nama Penumpang',
      passengerPhone: ticketData.passengerPhone || '08123456789',
      passengerIdNumber: ticketData.passengerIdNumber || '3174000000000000',
      passengerGender: ticketData.passengerGender || 'MALE',
      boardingPoint: ticketData.boardingPoint || 'Terminal Pulo Gebang',
      dropPoint: ticketData.dropPoint || 'Terminal Bungurasih',
      baseFare: ticketData.baseFare || 470000,
      insuranceFee: 5000,
      serviceFee: 5000,
      totalFare: (ticketData.baseFare || 470000) + 10000,
      paymentMethod: ticketData.paymentMethod || 'ONLINE_QRIS',
      paymentStatus: 'PAID',
      status: 'PAID',
      qrCodeData: `BUS-QR:${ticketNo}:${trip?.tripCode || 'SJ-702'}:${ticketData.seatNumber || 'S-05'}`,
      baggageWeightKg: ticketData.baggageWeightKg || 10,
      baggageTagNumber: `BAG-SJ-${Math.floor(1000 + Math.random() * 9000)}`,
      mealCouponClaimed: false,
      bookedAt: new Date().toISOString()
    };

    this.tickets.unshift(newTicket);

    // Update seat map status
    if (trip && trip.seatMap) {
      const seat = trip.seatMap.find(s => s.seatNumber === newTicket.seatNumber);
      if (seat) {
        seat.status = 'OCCUPIED';
        seat.passengerName = newTicket.passengerName;
        seat.ticketId = newTicket.id;
      }
      trip.bookedSeats = (trip.bookedSeats || 0) + 1;
    }

    return newTicket;
  }

  // QR Boarding Validator
  validateAndBoardTicket(
    ticketNumberOrQr: string,
    tripId: string,
    crewName: string
  ): { success: boolean; message: string; ticket?: BusTicket; seatNumber?: string } {
    const cleanSearch = ticketNumberOrQr.trim();
    const ticket = this.tickets.find(t => 
      t.ticketNumber === cleanSearch || 
      t.qrCodeData === cleanSearch ||
      t.qrCodeData.includes(cleanSearch) ||
      cleanSearch.includes(t.ticketNumber)
    );

    if (!ticket) {
      return { success: false, message: 'Tiket tidak ditemukan di sistem database.' };
    }

    if (ticket.status === 'CANCELLED') {
      return { success: false, message: 'TIKET DIBATALKAN: Tiket ini telah dibatalkan oleh penumpang/agen.' };
    }

    if (ticket.status === 'REFUNDED') {
      return { success: false, message: 'TIKET DI-REFUND: Tiket ini telah dikembalikan dananya dan tidak berlaku.' };
    }

    if (ticket.tripId !== tripId) {
      return { 
        success: false, 
        message: `SALAH TRIP/RITASE: Tiket ini untuk rute ${ticket.routeName} (${ticket.tripCode}), bukan untuk trip aktif saat ini.` 
      };
    }

    if (ticket.status === 'BOARDED') {
      return { 
        success: false, 
        message: `PERINGATAN: Tiket sudah di-boarding sebelumnya pada ${ticket.boardedAt} oleh ${ticket.checkedByCrewName}.` 
      };
    }

    // Mark Boarded
    ticket.status = 'BOARDED';
    ticket.boardedAt = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    ticket.boardedLocation = 'Pintu Masuk Bus / Gate Keberangkatan';
    ticket.checkedByCrewName = crewName;

    const trip = this.trips.find(t => t.id === tripId);
    if (trip) {
      trip.boardedCount = (trip.boardedCount || 0) + 1;
      const seat = trip.seatMap?.find(s => s.seatNumber === ticket.seatNumber);
      if (seat) {
        seat.status = 'BOARDED';
      }
    }

    return {
      success: true,
      message: `BOARDING BERHASIL: Penumpang ${ticket.passengerName} (Kursi ${ticket.seatNumber}) telah diverifikasi.`,
      ticket,
      seatNumber: ticket.seatNumber
    };
  }

  // Emergency Panic Trigger
  triggerEmergencyAlert(alertData: Partial<BusEmergencyAlert>): BusEmergencyAlert {
    const newAlert: BusEmergencyAlert = {
      id: `emg-${Date.now()}`,
      alertCode: `EMG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      busId: alertData.busId || 'bus-01',
      busPlateNumber: alertData.busPlateNumber || 'B 7102 SGA',
      tripId: alertData.tripId || 'trip-01',
      tripCode: alertData.tripCode || 'SJ-702-TRANS-JAWA',
      driverName: alertData.driverName || 'Sutrisno',
      driverPhone: alertData.driverPhone || '0812-7788-9901',
      locationName: alertData.locationName || 'Tol Cikampek Utama KM 70',
      coordinates: alertData.coordinates || { lat: -6.4421, lng: 107.4512 },
      currentSpeedKmH: alertData.currentSpeedKmH || 0,
      passengerCount: alertData.passengerCount || 21,
      panicType: alertData.panicType || 'MANUAL_PANIC_BUTTON',
      status: 'TRIGGERED',
      actionLogs: [
        `[${new Date().toLocaleTimeString()}] Panic Button diaktifkan dari kabin bus.`,
        `[${new Date().toLocaleTimeString()}] Broadcast alert dikirim ke Fleet Command Center & Dispatcher.`
      ]
    };

    this.emergencyAlerts.unshift(newAlert);
    return newAlert;
  }

  resolveEmergencyAlert(alertId: string): BusEmergencyAlert | undefined {
    const alert = this.emergencyAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'RESOLVED';
      alert.actionLogs.push(`[${new Date().toLocaleTimeString()}] Insiden telah ditangani & diverifikasi aman oleh Dispatcher.`);
    }
    return alert;
  }

  createCargoPackage(cargoData: Partial<BusCargoPackage>): BusCargoPackage {
    const newCargo: BusCargoPackage = {
      id: `crg-${Date.now()}`,
      receiptNumber: `CRG-PO-${Math.floor(10000 + Math.random() * 90000)}`,
      tripId: cargoData.tripId || 'trip-01',
      tripCode: cargoData.tripCode || 'SJ-702-TRANS-JAWA',
      busPlateNumber: cargoData.busPlateNumber || 'B 7102 SGA',
      senderName: cargoData.senderName || 'Pengirim Paket',
      senderPhone: cargoData.senderPhone || '081200000000',
      senderCity: cargoData.senderCity || 'Jakarta',
      receiverName: cargoData.receiverName || 'Penerima Paket',
      receiverPhone: cargoData.receiverPhone || '081300000000',
      receiverCity: cargoData.receiverCity || 'Surabaya',
      originAgent: cargoData.originAgent || 'Agen Terminal Pulo Gebang',
      destinationAgent: cargoData.destinationAgent || 'Agen Pool Bungurasih',
      itemDescription: cargoData.itemDescription || 'Kargo Paket Kilat Bagasi Bus',
      packageType: cargoData.packageType || 'GENERAL_CARGO',
      weightKg: cargoData.weightKg || 10,
      koliCount: cargoData.koliCount || 1,
      cargoFee: cargoData.cargoFee || 120000,
      paymentStatus: cargoData.paymentStatus || 'PAID',
      status: 'LOADED_ON_BUS',
      createdAt: new Date().toISOString()
    };

    this.cargoPackages.unshift(newCargo);
    return newCargo;
  }

  createComplaint(complaintData: Partial<BusPassengerComplaint>): BusPassengerComplaint {
    const newComplaint: BusPassengerComplaint = {
      id: `cmp-${Date.now()}`,
      complaintNumber: `CMP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      category: complaintData.category || 'SERVICE',
      passengerName: complaintData.passengerName || 'Pelanggan Bus',
      passengerPhone: complaintData.passengerPhone || '081200000000',
      tripCode: complaintData.tripCode || 'SJ-702-TRANS-JAWA',
      busPlateNumber: complaintData.busPlateNumber || 'B 7102 SGA',
      description: complaintData.description || 'Keluhan pelayanan',
      severity: complaintData.severity || 'MEDIUM',
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };

    this.complaints.unshift(newComplaint);
    return newComplaint;
  }

  resolveComplaint(id: string, resolutionNotes: string): BusPassengerComplaint | undefined {
    const complaint = this.complaints.find(c => c.id === id);
    if (complaint) {
      complaint.status = 'RESOLVED';
      complaint.resolutionNotes = resolutionNotes;
      complaint.resolvedAt = new Date().toISOString();
    }
    return complaint;
  }

  startTrip(tripId: string): boolean {
    const trip = this.trips.find(t => t.id === tripId);
    if (!trip) return false;
    trip.status = 'IN_TRANSIT';
    const bus = this.buses.find(b => b.id === trip.busId);
    if (bus) bus.status = 'ON_TRIP';
    return true;
  }

  completeTrip(tripId: string): boolean {
    const trip = this.trips.find(t => t.id === tripId);
    if (!trip) return false;
    trip.status = 'COMPLETED';
    const bus = this.buses.find(b => b.id === trip.busId);
    if (bus) bus.status = 'AVAILABLE';
    return true;
  }

  // AI Bus Assistant Q&A
  answerAiBusQuery(query: string): string {
    const q = query.toLowerCase();
    const kpis = this.getKPIs();

    if (q.includes('berapa bus') || q.includes('beroperasi') || q.includes('jumlah bus')) {
      return `Saat ini terdapat **${kpis.totalActiveBuses} unit armada bus aktif** dalam sistem, dengan rincian **${kpis.busesEnRoute} unit sedang berjalan di rute (En-Route)**, **${kpis.busesInPool} unit siap di pool/terminal**, dan **${kpis.busesInMaintenance} unit dalam perawatan bengkel**.`;
    }

    if (q.includes('paling banyak penumpang') || q.includes('okupansi tertinggi') || q.includes('paling ramai')) {
      const topTrip = [...this.trips].sort((a, b) => (b.bookedSeats / b.totalSeats) - (a.bookedSeats / a.totalSeats))[0];
      return `Trip dengan okupansi tertinggi adalah **${topTrip?.tripCode} (${topTrip?.routeName})** dengan tingkat keterisian **${Math.round((topTrip?.bookedSeats / topTrip?.totalSeats) * 100)}%** (${topTrip?.bookedSeats} dari ${topTrip?.totalSeats} kursi terisi).`;
    }

    if (q.includes('profitable') || q.includes('keuntungan') || q.includes('paling untung') || q.includes('profit')) {
      return `Rute paling profitable bulan ini adalah **Jakarta ➔ Surabaya via Tol Trans Jawa (JKT-SBY-01)** dengan estimasi profit margin **41.2%** dan Revenue/km sebesar **Rp 14.800/km** didukung oleh tingginya okupansi kelas Sleeper Suites dan muatan Kargo Kilat Bagasi.`;
    }

    if (q.includes('terlambat') || q.includes('delay') || q.includes('macet')) {
      const delayed = this.trips.filter(t => t.delayMinutes > 0);
      if (delayed.length === 0) {
        return `Seluruh ritase bus saat ini beroperasi **tepat waktu (On-Time Performance 95.4%)** tanpa keterlambatan signifikan di jalur Trans-Jawa.`;
      }
      return `Terdapat ${delayed.length} trip mengalami keterlambatan minor: **${delayed.map(d => `${d.tripCode} (+${d.delayMinutes} menit karena ${d.currentLocationName})`).join(', ')}**.`;
    }

    if (q.includes('boros bbm') || q.includes('solar') || q.includes('konsumsi')) {
      return `Rata-rata konsumsi solar armada adalah **${kpis.averageFuelConsumptionKmPerLiter} km/Liter**. Bus **AD 1455 GA (Scania Double Decker)** mencatat konsumsi 3.1 km/L karena muatan berat bertingkat, masih dalam batas toleransi pabrikan (3.0 - 3.4 km/L). Tidak terdeteksi anomali *fuel theft* atau *siphon drain*.`;
    }

    if (q.includes('driver') || q.includes('supir') || q.includes('fatigue') || q.includes('risiko')) {
      return `Seluruh supir aktif memiliki skor keselamatan di atas **96/100**. Supir **Sutrisno (Pak Tris)** telah mengemudi selama 3.2 jam dan dijadwalkan pergantian ke supir cadangan **Haryanto Wibowo** di Rest Area KM 228 Pejagan sesuai regulasi max 4 jam istirahat.`;
    }

    if (q.includes('okupansi hari ini') || q.includes('load factor')) {
      return `Rata-rata Load Factor (Okupansi) hari ini tercatat **${kpis.averageOccupancyRatePct}%** dengan total **${kpis.dailyPassengersCarried} penumpang** telah diberangkatkan ke berbagai kota tujuan.`;
    }

    if (q.includes('revenue') || q.includes('pendapatan')) {
      return `Total pendapatan hari ini mencapai **Rp ${(kpis.totalDailyTicketRevenue / 1000000).toFixed(1)} Juta** dari tiket penumpang reguler, ditambah **Rp ${(kpis.totalDailyCargoRevenue / 1000000).toFixed(1)} Juta** dari ekspedisi paket bagasi, dan **Rp ${(kpis.totalDailyCharterRevenue / 1000000).toFixed(1)} Juta** dari sewa bus pariwisata.`;
    }

    if (q.includes('service') || q.includes('bengkel') || q.includes('maintenance')) {
      return `Armada yang mendekati jadwal servis berkala: **BUS-088 (Mercedes OF 1623)** tersisa 5.900 km sebelum servis 40.000 km, dan uji KIR berlaku hingga 2027. Seluruh 5 unit bus telah lulus Ramp Check Dishub 100%.`;
    }

    return `Berdasarkan telematika real-time PO Bus: Total ${kpis.totalActiveBuses} armada beroperasi prima dengan okupansi ${kpis.averageOccupancyRatePct}%, OTP ${kpis.onTimePerformancePct}%, dan pendapatan harian Rp ${(kpis.totalDailyTicketRevenue / 1000000).toFixed(1)}M. Ada hal spesifik yang ingin dianalisis lebih lanjut?`;
  }
}

export const busService = new BusService();
