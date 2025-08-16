import { Entity, Type } from '@graphprotocol/hypergraph';

export class Image extends Entity.Class<Image>('Image')({
  url: Type.String,
}) {}

export class Hacker extends Entity.Class<Hacker>('Hacker')({
  name: Type.String,
  walletAddress: Type.String,
  githubUrl: Type.optional(Type.String),
  twitterUrl: Type.optional(Type.String),
  avatar: Type.Relation(Image),
}) {}

export class Property extends Entity.Class<Property>('Property')({
  name: Type.String,
  description: Type.optional(Type.String),
  image: Type.Relation(Image),
  location: Type.optional(Type.String),
  price: Type.optional(Type.Number),
  size: Type.optional(Type.Number),
  bedrooms: Type.optional(Type.Number),
  bathrooms: Type.optional(Type.Number),
  parking: Type.optional(Type.Number),
  amenities: Type.optional(Type.String),
  features: Type.optional(Type.String),
  status: Type.optional(Type.String),
  type: Type.optional(Type.String),
}) {}

export class Landlord extends Entity.Class<Landlord>('Landlord')({
  name: Type.String,
  walletAddress: Type.String,
  avatar: Type.Relation(Image),
  properties: Type.Relation(Property),
}) {}

export class City extends Entity.Class<City>('City')({
  name: Type.String,
  description: Type.optional(Type.String),
  image: Type.Relation(Image),
  properties: Type.Relation(Property),
}) {}

export class Country extends Entity.Class<Country>('Country')({
  name: Type.String,
  description: Type.optional(Type.String),
  image: Type.Relation(Image),
  properties: Type.Relation(Property),
}) {}

export class Event extends Entity.Class<Event>('Event')({
  name: Type.String,
  description: Type.optional(Type.String),
  startDate: Type.optional(Type.String),
  endDate: Type.optional(Type.String),
  organizer: Type.optional(Type.String),
  image: Type.Relation(Image),
  city: Type.Relation(City),
  country: Type.Relation(Country),
  properties: Type.Relation(Property),
  hackers: Type.Relation(Hacker),
  landlords:Type.Relation(Landlord),
  
}) {}

