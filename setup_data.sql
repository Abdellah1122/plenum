-- Artworks Table
create table artworks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  artist text not null,
  year text,
  price integer, -- Price in cents or basic currency unit
  image_url text, -- URL to image
  category text, 
  status text default 'available' check (status in ('available', 'sold', 'auction'))
);

-- Auctions Table
create table auctions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  artwork_id uuid references artworks(id) not null,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  start_price integer,
  current_bid integer
);

-- RLS
alter table artworks enable row level security;
alter table auctions enable row level security;

create policy "Artworks are viewable by everyone." on artworks for select using (true);
create policy "Auctions are viewable by everyone." on auctions for select using (true);

-- Mock Data
insert into artworks (title, artist, year, price, category, status) values
('Composition Abstraite IV', 'Elena Vosk', '2023', 12500, 'Peinture', 'available'),
('Silence en Bleu', 'Marcus Reed', '2024', 4200, 'Photographie', 'available'),
('Forme Structurelle', 'Sarah J.', '2022', 6800, 'Sculpture', 'available'),
('Digital Horizon', 'Nex Art', '2024', 3500, 'Numérique', 'available'),
('Écho du Temps', 'Elena Vosk', '2021', 8900, 'Peinture', 'available'),
('Métamorphose', 'Jean Luc', '2023', 5400, 'Sculpture', 'available');

insert into auctions (artwork_id, start_time, end_time, start_price, current_bid) 
select id, now(), now() + interval '3 days', price, price + 500 
from artworks where title = 'Composition Abstraite IV';
