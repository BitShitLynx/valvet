alter table pacientes add column if not exists castrado boolean default false;
alter table pacientes add column if not exists antirrabica boolean default false;
alter table pacientes add column if not exists vacunas text[] default '{}';
