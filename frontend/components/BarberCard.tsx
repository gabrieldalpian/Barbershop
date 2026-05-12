'use client';

import Link from 'next/link';
import Image from 'next/image';

interface BarberCardProps {
  id: string;
  name: string;
  specialty: string;
  bio?: string;
  photoUrl?: string;
  rating: number;
  ratingCount: number;
  featured?: boolean;
}

export function BarberCard({
  id,
  name,
  specialty,
  bio,
  photoUrl,
  rating,
  ratingCount,
  featured = false,
}: BarberCardProps) {
  return (
    <Link href={`/book?barber=${id}`}>
      <div className={`group cursor-pointer ${featured ? 'md:col-span-2' : ''}`}>
        <div className={`card-elevated flex flex-col h-full ${featured ? 'md:flex-row md:items-center md:gap-6' : ''}`}>
          {/* Photo */}
          <div className={`relative mb-4 ${featured ? 'md:mb-0 md:w-1/3' : 'w-full'}`}>
            <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden bg-gray-100">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={`${name} — barber`}
                  fill
                  className="object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gold-50 to-gold-100 flex flex-col items-center justify-center gap-2">
                  <div className="w-20 h-20 rounded-full bg-gold-500/20 border-2 border-gold-300 flex items-center justify-center">
                    <span className="text-4xl font-black text-gold-500">{name.charAt(0)}</span>
                  </div>
                  <span className="text-xs text-gold-600 font-semibold uppercase tracking-widest">Barber</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className={`flex flex-col flex-1 ${featured ? 'md:w-2/3' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-black text-gray-900 group-hover:text-gold-600 transition-colors">
                  {name}
                </h3>
                <p className="text-sm text-gold-600 font-semibold">{specialty}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < Math.round(rating) ? 'text-gold-500' : 'text-gray-200'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {rating.toFixed(1)} ({ratingCount} reviews)
              </span>
            </div>

            {/* Bio */}
            {bio && (
              <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">{bio}</p>
            )}

            {/* CTA */}
            <div className="flex items-center gap-2 text-gold-600 font-bold text-sm group-hover:gap-3 transition-all mt-auto pt-2 border-t border-gray-100">
              Book with {name} <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function BarberGrid({ barbers, featured }: { barbers: BarberCardProps[]; featured?: boolean }) {
  if (!barbers.length) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Our barbers are currently unavailable. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {barbers.map((barber, i) => (
        <div key={barber.id} className={`fade-in-delay-${(i % 3) + 1} animate-fade-in`}>
          <BarberCard {...barber} featured={featured && i === 0} />
        </div>
      ))}
    </div>
  );
}
