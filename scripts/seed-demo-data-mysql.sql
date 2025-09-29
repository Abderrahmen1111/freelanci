-- Données de démonstration pour Freelancii.tn

-- Insérer des utilisateurs de test
INSERT INTO users (id, email, password_hash, first_name, last_name, user_type, phone, location, company, skills, experience, avatar_url, is_verified, subscription_plan) VALUES
-- Admin
('admin-001', 'admin@freelancii.tn', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Ahmed', 'Ben Ali', 'admin', '+216 20 123 456', 'Tunis', 'Freelancii.tn', '["Administration", "Gestion"]', 'Administrateur de la plateforme', '/placeholder.svg?height=100&width=100', true, 'enterprise'),

-- Clients
('client-001', 'client1@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Fatma', 'Trabelsi', 'client', '+216 22 345 678', 'Sfax', 'TechStart SARL', '[]', 'Directrice technique chez TechStart', '/placeholder.svg?height=100&width=100', true, 'pro'),
('client-002', 'client2@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Mohamed', 'Karray', 'client', '+216 25 789 012', 'Sousse', 'Digital Solutions', '[]', 'CEO de Digital Solutions', '/placeholder.svg?height=100&width=100', true, 'free'),
('client-003', 'client3@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Leila', 'Mansouri', 'client', '+216 28 456 789', 'Monastir', 'E-Commerce Plus', '[]', 'Responsable marketing digital', '/placeholder.svg?height=100&width=100', true, 'pro'),

-- Freelancers
('freelancer-001', 'dev1@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Youssef', 'Ben Salem', 'freelancer', '+216 21 234 567', 'Tunis', NULL, '["React", "Node.js", "TypeScript", "MongoDB"]', 'Développeur Full-Stack avec 5 ans d\'expérience', '/placeholder.svg?height=100&width=100', true, 'pro'),
('freelancer-002', 'designer1@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Amira', 'Bouaziz', 'freelancer', '+216 24 567 890', 'Ariana', NULL, '["UI/UX Design", "Figma", "Adobe Creative Suite", "Prototyping"]', 'Designer UI/UX passionnée par l\'expérience utilisateur', '/placeholder.svg?height=100&width=100', true, 'free'),
('freelancer-003', 'mobile1@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Karim', 'Jebali', 'freelancer', '+216 27 890 123', 'Gabès', NULL, '["Flutter", "React Native", "iOS", "Android"]', 'Développeur mobile spécialisé en applications cross-platform', '/placeholder.svg?height=100&width=100', true, 'pro'),
('freelancer-004', 'marketing1@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Sarra', 'Hamdi', 'freelancer', '+216 29 123 456', 'Bizerte', NULL, '["SEO", "Google Ads", "Social Media", "Content Marketing"]', 'Experte en marketing digital et référencement', '/placeholder.svg?height=100&width=100', true, 'free'),
('freelancer-005', 'writer1@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Nabil', 'Cherif', 'freelancer', '+216 26 789 012', 'Kairouan', NULL, '["Rédaction", "Traduction", "Copywriting", "SEO Writing"]', 'Rédacteur et traducteur français-arabe-anglais', '/placeholder.svg?height=100&width=100', true, 'free'),
('freelancer-006', 'data1@example.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Rim', 'Ouali', 'freelancer', '+216 23 456 789', 'Nabeul', NULL, '["Python", "Data Analysis", "Machine Learning", "SQL"]', 'Data Scientist spécialisée en intelligence artificielle', '/placeholder.svg?height=100&width=100', true, 'pro');

-- Insérer des projets
INSERT INTO projects (id, title, description, client_id, freelancer_id, budget, status, progress, deadline, skills_required) VALUES
('project-001', 'Site E-commerce pour vêtements', 'Développement d\'une boutique en ligne moderne avec panier, paiement et gestion des stocks', 'client-001', 'freelancer-001', 2500.00, 'in_progress', 65, '2024-03-15 00:00:00', '["React", "Node.js", "MongoDB", "Stripe"]'),
('project-002', 'Application mobile de livraison', 'App mobile pour service de livraison avec géolocalisation et suivi en temps réel', 'client-002', 'freelancer-003', 4000.00, 'in_progress', 40, '2024-04-01 00:00:00', '["Flutter", "Firebase", "Google Maps", "Push Notifications"]'),
('project-003', 'Refonte UI/UX site corporate', 'Redesign complet de l\'interface utilisateur d\'un site d\'entreprise', 'client-003', 'freelancer-002', 1800.00, 'completed', 100, '2024-02-28 00:00:00', '["UI/UX Design", "Figma", "Responsive Design"]'),
('project-004', 'Campagne SEO et marketing digital', 'Optimisation SEO et stratégie de marketing digital pour augmenter la visibilité', 'client-001', 'freelancer-004', 1200.00, 'in_progress', 75, '2024-03-30 00:00:00', '["SEO", "Google Ads", "Analytics", "Content Marketing"]'),
('project-005', 'Rédaction de contenu blog', 'Création de 20 articles de blog optimisés SEO pour site tech', 'client-002', 'freelancer-005', 800.00, 'completed', 100, '2024-02-15 00:00:00', '["Rédaction", "SEO Writing", "Tech Content"]'),
('project-006', 'Analyse de données clients', 'Analyse des données de vente et création de tableaux de bord', 'client-003', 'freelancer-006', 1500.00, 'published', 0, '2024-04-15 00:00:00', '["Python", "Data Analysis", "Visualization", "SQL"]'),
('project-007', 'Site vitrine restaurant', 'Création d\'un site vitrine avec menu en ligne et réservations', 'client-001', NULL, 1000.00, 'published', 0, '2024-05-01 00:00:00', '["WordPress", "Design", "Responsive"]'),
('project-008', 'Logo et identité visuelle', 'Création de logo et charte graphique pour startup', 'client-002', 'freelancer-002', 600.00, 'draft', 0, '2024-04-30 00:00:00', '["Graphic Design", "Branding", "Logo Design"]');

-- Insérer des services
INSERT INTO services (id, freelancer_id, title, description, price_from, category, is_active) VALUES
('service-001', 'freelancer-001', 'Développement site web React', 'Création de sites web modernes avec React et Node.js', 1500.00, 'Développement Web', true),
('service-002', 'freelancer-002', 'Design UI/UX complet', 'Conception d\'interfaces utilisateur modernes et intuitives', 800.00, 'Design', true),
('service-003', 'freelancer-003', 'Application mobile Flutter', 'Développement d\'applications mobiles cross-platform', 2000.00, 'Mobile', true),
('service-004', 'freelancer-004', 'Audit SEO complet', 'Analyse complète de votre site et stratégie d\'optimisation', 500.00, 'Marketing', true),
('service-005', 'freelancer-005', 'Rédaction articles blog', 'Création de contenu optimisé SEO pour votre blog', 50.00, 'Rédaction', true),
('service-006', 'freelancer-006', 'Analyse de données business', 'Analyse de vos données et création de rapports détaillés', 1000.00, 'Data Science', true);

-- Insérer des paiements
INSERT INTO payments (id, project_id, payer_id, receiver_id, amount, commission, status, payment_method, transaction_id) VALUES
('payment-001', 'project-003', 'client-003', 'freelancer-002', 1800.00, 180.00, 'completed', 'card', 'txn_001'),
('payment-002', 'project-005', 'client-002', 'freelancer-005', 800.00, 80.00, 'completed', 'card', 'txn_002'),
('payment-003', 'project-001', 'client-001', 'freelancer-001', 1250.00, 125.00, 'completed', 'card', 'txn_003'),
('payment-004', 'project-002', 'client-002', 'freelancer-003', 2000.00, 200.00, 'pending', 'card', 'txn_004'),
('payment-005', 'project-004', 'client-001', 'freelancer-004', 600.00, 60.00, 'completed', 'mobile', 'txn_005');

-- Insérer des avis
INSERT INTO reviews (id, project_id, reviewer_id, reviewed_id, rating, comment) VALUES
('review-001', 'project-003', 'client-003', 'freelancer-002', 5, 'Excellent travail ! Le design est moderne et parfaitement adapté à nos besoins.'),
('review-002', 'project-005', 'client-002', 'freelancer-005', 4, 'Contenu de qualité, livré dans les délais. Très satisfait du résultat.'),
('review-003', 'project-001', 'client-001', 'freelancer-001', 5, 'Développeur très professionnel, code propre et fonctionnalités parfaites.'),
('review-004', 'project-004', 'client-001', 'freelancer-004', 4, 'Bonne stratégie SEO, résultats visibles rapidement.'),
('review-005', 'project-002', 'client-002', 'freelancer-003', 5, 'Application mobile excellente, interface intuitive et performance optimale.');

-- Insérer des abonnements
INSERT INTO subscriptions (id, user_id, plan_id, status, current_period_start, current_period_end) VALUES
('sub-001', 'client-001', 'pro', 'active', '2024-01-01 00:00:00', '2024-02-01 00:00:00'),
('sub-002', 'freelancer-001', 'pro', 'active', '2024-01-15 00:00:00', '2024-02-15 00:00:00'),
('sub-003', 'freelancer-003', 'pro', 'active', '2024-01-20 00:00:00', '2024-02-20 00:00:00'),
('sub-004', 'freelancer-006', 'pro', 'active', '2024-01-10 00:00:00', '2024-02-10 00:00:00'),
('sub-005', 'admin-001', 'enterprise', 'active', '2024-01-01 00:00:00', '2024-12-31 00:00:00');

-- Insérer des notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES
('notif-001', 'freelancer-001', 'Nouveau projet disponible', 'Un nouveau projet correspond à vos compétences : "Site E-commerce"', 'project', false),
('notif-002', 'client-001', 'Projet terminé', 'Le projet "Refonte UI/UX" a été marqué comme terminé', 'project', true),
('notif-003', 'freelancer-002', 'Paiement reçu', 'Vous avez reçu un paiement de 1800 DT pour le projet terminé', 'payment', true),
('notif-004', 'client-002', 'Nouveau message', 'Vous avez reçu un message concernant votre projet mobile', 'message', false),
('notif-005', 'freelancer-004', 'Évaluation reçue', 'Vous avez reçu une nouvelle évaluation 4/5 étoiles', 'review', false);
