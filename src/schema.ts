import { Entity, Type } from '@graphprotocol/hypergraph';

export class Image extends Entity.Class<Image>('Image')({
  url: Type.String
}) {}

export class Hacker extends Entity.Class<Hacker>('Hacker')({
  name: Type.String,
  walletAddress: Type.String,
  githubUrl: Type.String,
  twitterUrl: Type.String,
  avatar: Type.Relation(Image)
}) {}

export class Property extends Entity.Class<Property>('Property')({
  name: Type.String,
  description: Type.String,
  image: Type.Relation(Image),
  location: Type.String,
  price: Type.Number,
  size: Type.Number,
  bedrooms: Type.Number,
  bathrooms: Type.Number,
  parking: Type.Number,
  amenities: Type.String,
  wifi: Type.Boolean,
  features: Type.String,
  status: Type.String,
  type: Type.String,
  deposit: Type.Number
}) {}

export class Landlord extends Entity.Class<Landlord>('Landlord')({
  name: Type.String,
  walletAddress: Type.String,
  avatar: Type.Relation(Image),
  verified: Type.Boolean
}) {}

export class City extends Entity.Class<City>('City')({
  name: Type.String,
  description: Type.String,
  image: Type.Relation(Image)
}) {}

export class Country extends Entity.Class<Country>('Country')({
  name: Type.String,
  description: Type.String,
  image: Type.Relation(Image)
}) {}

export class Event extends Entity.Class<Event>('Event')({
  name: Type.String,
  description: Type.String,
  startDate: Type.String,
  endDate: Type.String,
  organizer: Type.String,
  image: Type.Relation(Image)
}) {}

export class Booking extends Entity.Class<Booking>('Booking')({
  property: Type.Relation(Property),
  hackers: Type.Relation(Hacker),
  landlord: Type.Relation(Landlord),
  checkIn: Type.String,
  checkOut: Type.String,
  status: Type.String,
  totalPrice: Type.Number,
  deposit: Type.Number,
  guestCount: Type.Number,
  paymentStatus: Type.String,
  paymentDate: Type.String,
  paymentAmount: Type.Number,
  paymentCurrency: Type.String,
  notes: Type.String,
  createdAt: Type.String,
  updatedAt: Type.String,
  cancelledAt: Type.String,
  cancelledBy: Type.String,
  cancelledReason: Type.String,
  cancelledNotes: Type.String
}) {}

export class Review extends Entity.Class<Review>('Review')({
  rating: Type.Number,
  comment: Type.String,
  createdAt: Type.String
}) {}

export class BookingPayment extends Entity.Class<BookingPayment>('BookingPayment')({
  amount: Type.Number,
  securityDeposit: Type.Number,
  paymentStatus: Type.String,
  paymentDate: Type.String,
  walletAddress: Type.String,
  transactionHash: Type.String
}) {}

export class HackerGroup extends Entity.Class<HackerGroup>('HackerGroup')({
  name: Type.String,
  description: Type.String,
  image: Type.Relation(Image)
}) {}

export class EscrowContract extends Entity.Class<EscrowContract>('EscrowContract')({
  contractAddress: Type.String,
  totalAmount: Type.Number,
  securityDeposit: Type.Number,
  status: Type.String,
  dateCreated: Type.String,
  dateReleased: Type.String
}) {}

