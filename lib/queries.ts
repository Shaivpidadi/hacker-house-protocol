import { useQuery } from '@graphprotocol/hypergraph-react';
import { Hacker, Property, Booking, Landlord, Event, Review } from '@/app/schema';

// query hooks for common operations
export function useAvailableProperties() {
  return useQuery({
    property: {
      where: { status: 'available' },
      select: {
        name: true,
        description: true,
        location: true,
        price: true,
        bedrooms: true,
        bathrooms: true,
        wifi: true,
        amenities: true,
        image: {
          select: {
            url: true
          }
        }
      }
    }
  });
}

export function useHackerBookings(hackerWalletAddress: string) {
  return useQuery({
    booking: {
      where: { 
        hackers: { 
          where: { walletAddress: hackerWalletAddress } 
        } 
      },
      select: {
        checkIn: true,
        checkOut: true,
        status: true,
        totalPrice: true,
        property: {
          select: {
            name: true,
            location: true,
            image: {
              select: {
                url: true
              }
            }
          }
        }
      }
    }
  });
}

export function useLandlordProperties(landlordWalletAddress: string) {
  return useQuery({
    property: {
      where: { 
        landlord: { 
          where: { walletAddress: landlordWalletAddress } 
        } 
      },
      select: {
        name: true,
        description: true,
        location: true,
        price: true,
        status: true,
        image: {
          select: {
            url: true
          }
        },
        bookings: {
          select: {
            checkIn: true,
            checkOut: true,
            status: true,
            totalPrice: true
          }
        }
      }
    }
  });
}

export function usePropertyReviews(propertyId: string) {
  return useQuery({
    review: {
      where: { property: { where: { id: propertyId } } },
      select: {
        rating: true,
        comment: true,
        createdAt: true,
        hacker: {
          select: {
            name: true,
            avatar: {
              select: {
                url: true
              }
            }
          }
        }
      }
    }
  });
}

export function useUpcomingEvents() {
  return useQuery({
    event: {
      where: { startDate: { gte: new Date().toISOString() } },
      select: {
        name: true,
        description: true,
        startDate: true,
        endDate: true,
        organizer: true,
        image: {
          select: {
            url: true
          }
        }
      }
    }
  });
}

export function usePropertyAvailability(propertyId: string, startDate: string, endDate: string) {
  return useQuery({
    booking: {
      where: { 
        property: { where: { id: propertyId } },
        checkIn: { lte: endDate },
        checkOut: { gte: startDate }
      },
      select: {
        checkIn: true,
        checkOut: true,
        status: true
      }
    }
  });
}

// ADVANCED ANALYTICS QUERIES

// 1. Hacker Roommate History - Find hackers who have roomed together before
export function useHackerRoommateHistory(hackerWalletAddress: string) {
  return useQuery({
    booking: {
      where: { 
        hackers: { 
          where: { walletAddress: hackerWalletAddress } 
        },
        status: 'completed'
      },
      select: {
        checkIn: true,
        checkOut: true,
        property: {
          select: {
            name: true,
            location: true
          }
        },
        hackers: {
          select: {
            name: true,
            walletAddress: true,
            githubUrl: true,
            avatar: {
              select: {
                url: true
              }
            }
          }
        }
      }
    }
  });
}

// 2. Most Popular Properties - Properties with highest booking count
export function useMostPopularProperties(limit: number = 10) {
  return useQuery({
    property: {
      select: {
        name: true,
        location: true,
        price: true,
        image: {
          select: {
            url: true
          }
        },
        bookings: {
          select: {
            id: true,
            status: true,
            totalPrice: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    }
  });
}

// 3. Payment Analytics - Most common payment methods and amounts
export function usePaymentAnalytics() {
  return useQuery({
    bookingPayment: {
      select: {
        amount: true,
        securityDeposit: true,
        paymentStatus: true,
        paymentDate: true,
        paymentCurrency: true,
        walletAddress: true,
        transactionHash: true,
        booking: {
          select: {
            totalPrice: true,
            property: {
              select: {
                name: true,
                location: true
              }
            }
          }
        }
      }
    }
  });
}

// 4. Landlord Performance Analytics
export function useLandlordAnalytics(landlordWalletAddress: string) {
  return useQuery({
    landlord: {
      where: { walletAddress: landlordWalletAddress },
      select: {
        name: true,
        verified: true,
        properties: {
          select: {
            name: true,
            location: true,
            price: true,
            status: true,
            bookings: {
              select: {
                checkIn: true,
                checkOut: true,
                status: true,
                totalPrice: true,
                guestCount: true
              }
            },
            reviews: {
              select: {
                rating: true,
                comment: true
              }
            }
          }
        }
      }
    }
  });
}

// 5. Event-Driven Property Demand
export function useEventPropertyDemand(eventId: string) {
  return useQuery({
    event: {
      where: { id: eventId },
      select: {
        name: true,
        startDate: true,
        endDate: true,
        properties: {
          select: {
            name: true,
            location: true,
            price: true,
            bookings: {
              where: {
                checkIn: { lte: '2024-03-17T23:59:59Z' },
                checkOut: { gte: '2024-03-15T00:00:00Z' }
              },
              select: {
                checkIn: true,
                checkOut: true,
                status: true,
                totalPrice: true,
                guestCount: true
              }
            }
          }
        }
      }
    }
  });
}

// 6. Hacker Travel Patterns
export function useHackerTravelPatterns(hackerWalletAddress: string) {
  return useQuery({
    booking: {
      where: { 
        hackers: { 
          where: { walletAddress: hackerWalletAddress } 
        },
        status: 'completed'
      },
      select: {
        checkIn: true,
        checkOut: true,
        totalPrice: true,
        property: {
          select: {
            location: true,
            city: {
              select: {
                name: true,
                country: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        },
        events: {
          select: {
            name: true,
            startDate: true,
            endDate: true
          }
        }
      }
    }
  });
}

// 7. Property Revenue Analytics
export function usePropertyRevenueAnalytics(propertyId: string) {
  return useQuery({
    property: {
      where: { id: propertyId },
      select: {
        name: true,
        price: true,
        bookings: {
          where: { status: 'completed' },
          select: {
            checkIn: true,
            checkOut: true,
            totalPrice: true,
            guestCount: true,
            paymentStatus: true
          }
        }
      }
    }
  });
}

// 8. Hackathon Sponsor Insights
export function useHackathonSponsorInsights() {
  return useQuery({
    event: {
      select: {
        name: true,
        startDate: true,
        endDate: true,
        organizer: true,
        properties: {
          select: {
            name: true,
            location: true,
            price: true,
            bookings: {
              select: {
                checkIn: true,
                checkOut: true,
                status: true,
                totalPrice: true,
                hackers: {
                  select: {
                    name: true,
                    githubUrl: true,
                    twitterUrl: true
                  }
                }
              }
            }
          }
        }
      }
    }
  });
}

// 9. Seasonal Booking Trends
export function useSeasonalBookingTrends() {
  return useQuery({
    booking: {
      where: { status: 'completed' },
      select: {
        checkIn: true,
        checkOut: true,
        totalPrice: true,
        guestCount: true,
        property: {
          select: {
            location: true,
            city: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }
  });
}

// 10. Hacker Skill Network - Hackers who attend same events
export function useHackerSkillNetwork(hackerWalletAddress: string) {
  return useQuery({
    hacker: {
      where: { walletAddress: hackerWalletAddress },
      select: {
        name: true,
        githubUrl: true,
        events: {
          select: {
            name: true,
            startDate: true,
            endDate: true,
            hackers: {
              select: {
                name: true,
                githubUrl: true,
                twitterUrl: true,
                avatar: {
                  select: {
                    url: true
                  }
                }
              }
            }
          }
        }
      }
    }
  });
}

// 11. Property Amenity Preferences
export function usePropertyAmenityPreferences() {
  return useQuery({
    property: {
      select: {
        amenities: true,
        wifi: true,
        features: true,
        bookings: {
          select: {
            status: true,
            totalPrice: true,
            reviews: {
              select: {
                rating: true,
                comment: true
              }
            }
          }
        }
      }
    }
  });
}

// 12. Cancellation Analytics
export function useCancellationAnalytics() {
  return useQuery({
    booking: {
      where: { 
        OR: [
          { status: 'cancelled' },
          { cancelledAt: { not: null } }
        ]
      },
      select: {
        checkIn: true,
        checkOut: true,
        cancelledAt: true,
        cancelledReason: true,
        cancelledBy: true,
        totalPrice: true,
        property: {
          select: {
            name: true,
            location: true
          }
        },
        hackers: {
          select: {
            name: true,
            walletAddress: true
          }
        }
      }
    }
  });
}

// 13. Review Sentiment Analysis
export function useReviewSentimentAnalysis() {
  return useQuery({
    review: {
      select: {
        rating: true,
        comment: true,
        createdAt: true,
        property: {
          select: {
            name: true,
            location: true,
            amenities: true
          }
        },
        hacker: {
          select: {
            name: true
          }
        }
      }
    }
  });
}

// 14. Property Occupancy Rates
export function usePropertyOccupancyRates(propertyId: string, startDate: string, endDate: string) {
  return useQuery({
    booking: {
      where: { 
        property: { where: { id: propertyId } },
        checkIn: { lte: endDate },
        checkOut: { gte: startDate }
      },
      select: {
        checkIn: true,
        checkOut: true,
        status: true,
        guestCount: true
      }
    }
  });
}

// 15. Hacker Budget Analysis
export function useHackerBudgetAnalysis(hackerWalletAddress: string) {
  return useQuery({
    booking: {
      where: { 
        hackers: { 
          where: { walletAddress: hackerWalletAddress } 
        },
        status: 'completed'
      },
      select: {
        totalPrice: true,
        paymentAmount: true,
        paymentCurrency: true,
        checkIn: true,
        checkOut: true,
        property: {
          select: {
            location: true,
            price: true
          }
        }
      }
    }
  });
}

