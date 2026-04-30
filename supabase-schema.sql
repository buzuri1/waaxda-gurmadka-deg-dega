CREATE TABLE incidents (
  id SERIAL PRIMARY KEY,
  lambarka_warbixinta VARCHAR(20) UNIQUE NOT NULL,       -- Report Number e.g. MF-001
  taariikhda TIMESTAMP NOT NULL,                          -- Date & Time of incident
  degmada VARCHAR(100) NOT NULL,                          -- District / Location
  nooca_hantida VARCHAR(100) NOT NULL,                    -- Property type (Dab Guri, Dab Dukaan, etc)
  sababta_dabka VARCHAR(100) NOT NULL,                    -- Cause of fire
  magaca_milkiilaha VARCHAR(150) NOT NULL,               -- Owner/Resident name
  telefoon VARCHAR(30),                                   -- Phone number
  khasaaraha_nafeed VARCHAR(100),                         -- Human casualties (deaths/injuries)
  khasaaraha_hantida DECIMAL(15,2),                      -- Property damage (USD)
  tirada_dabdamiyasha INTEGER,                            -- Number of firefighters deployed
  tirada_gaadiidka INTEGER,                               -- Number of fire trucks deployed
  waqtiga_jawaabta INTEGER,                              -- Response time (minutes)
  muddada_hawlgalka INTEGER,                             -- Operation duration (minutes)
  biyaha_la_isticmaalay DECIMAL(10,2),                   -- Water used (liters)
  foam_la_isticmaalay DECIMAL(10,2),                     -- Foam used (liters)
  taliyaha_hawlgalka VARCHAR(100),                        -- Operation commander
  sharaxaadda TEXT,                                       -- Incident description
  xaaladda VARCHAR(30) DEFAULT 'xidhan',                 -- Status: furan / xidhan / baaraandegaynaya
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users" ON incidents FOR ALL TO authenticated USING (true);

-- Seed data: Insert these 10 records exactly:
INSERT INTO incidents (id, lambarka_warbixinta, taariikhda, degmada, nooca_hantida, sababta_dabka, magaca_milkiilaha, telefoon, khasaaraha_nafeed, khasaaraha_hantida, tirada_dabdamiyasha, tirada_gaadiidka, waqtiga_jawaabta, muddada_hawlgalka, biyaha_la_isticmaalay, foam_la_isticmaalay, taliyaha_hawlgalka, sharaxaadda, xaaladda, created_at, updated_at) VALUES
(1,'MF-001','2025-11-01 10:35:00','Waberi, Maka Al-Mukarama Road','Dab Guri','Koronto Gaaban','Ali Mohamed','252615000001','0 dhimasho / 1 dhaawac',3500,6,2,8,45,1200,0,'Cali Xasan','Dab ka dhashay fiilo koronto oo gubtay qol jiif ah.','xidhan',NOW(),NOW()),
(2,'MF-002','2025-11-02 14:10:00','Hodan, Taleex Street','Dab Dukaan','Sigaar ama Shidaal','Mohamed Abdi','252615000002','1 dhimasho / 2 dhaawac',12000,10,3,5,60,3500,100,'Ibrahim Nur','Dab ka kacay dukaan shidaal lagu iibiyo.','xidhan',NOW(),NOW()),
(3,'MF-003','2025-11-03 21:00:00','Hamar Weyne, Suuqa Bakaaraha','Dab Suuq','Koronto','Abdullahi Ali','252615000003','3 dhimasho / 5 dhaawac',65000,25,6,12,180,10000,400,'Roble Abdulle','Dab weyn oo ka kacay qeybta dharka ee suuqa Bakaaraha.','xidhan',NOW(),NOW()),
(4,'MF-004','2025-11-04 00:00:00','Yaqshid, Bar Ubah','Dab Gaari','Gaas ama Shidaal','Khadar Warsame','252615000004','2 dhaawac',8500,8,2,6,40,2000,0,'Abdi Fatah','Gaari ku qarxay kadib markii uu ku dhacay darbiga.','xidhan',NOW(),NOW()),
(5,'MF-005','2025-11-05 00:00:00','Karaan, Jamhuuriyah Street','Dab Guri','Ujeedo (Arson)','Amina Yusuf','252615000005','1 dhimasho',4000,5,1,7,35,800,0,'Ali Abdikarim','Dab si ula kac ah loo dhigay guri lagu murmay.','xidhan',NOW(),NOW()),
(6,'MF-006','2025-11-06 00:00:00','Shangani, Near Lido Beach','Dab Cunto karis','Shoolad Gaas','Hodan Ali','252615000006','0 dhimasho / 3 dhaawac',2000,6,2,4,25,600,0,'Jama Salad','Dab ka dhashay gaas daadanayey jikada makhaayad.','xidhan',NOW(),NOW()),
(7,'MF-007','2025-11-07 00:00:00','Wadajir, Airport Road','Dab Xafiis','Koronto','Abdirahman Omar','252615000007','0 dhimasho / 0 dhaawac',1800,4,1,6,30,500,0,'Ali Yasin','Dab ka dhashay xafiis shirkadeed oo ku yaal Airport Road.','xidhan',NOW(),NOW()),
(8,'MF-008','2025-11-08 00:00:00','Dharkenley, Digfeer Junction','Dab Dukaan','Koronto','Yusuf Ali','252615000008','0 dhimasho / 1 dhaawac',6000,7,2,9,55,2500,100,'Abdi Hakim','Dab ka kacay dukaan koronto oo alaabo badan ku gubteen.','xidhan',NOW(),NOW()),
(9,'MF-009','2025-11-09 00:00:00','Hamar Jajab, Daljirka Dahsoon','Dab Gaari','Shidaal','Omar Mahad','252615000009','2 dhaawac',9800,10,3,5,50,3000,200,'Yahye Mohamed','Dab ka dhashay baabuur shidaal siday oo shil galay.','xidhan',NOW(),NOW()),
(10,'MF-010','2025-11-10 00:00:00','Abdiaziz, KM4 Area','Dab Guri','Koronto Gaaban','Hawa Ahmed','252615000010','0 dhimasho / 0 dhaawac',500,3,1,4,15,300,0,'Ali Roble','Dab yar oo ka dhashay koronto oo lagu damiyay degdeg.','xidhan',NOW(),NOW());
