-- Active: 1690660213158@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT(DATETIME())
);

INSERT INTO users(id, name, email, password)
VALUES
    ('u001', 'Severina Maria da Silva', 'seve@email.com', 'seve123'),
    ('u002', 'Antônio Ferreira', 'tonho@email.com', 'toinho123'),
    ('u003', 'Flávia & Izabela', 'fi28112018@email.com', 'fi28112018');

DROP TABLE users;

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT(DATETIME()),
    update_at TEXT NOT NULL DEFAULT(DATETIME()),
    Foreign Key (creator_id) REFERENCES users(id)
    --ON UPDATE CASCADE
    --ON DELETE CASCADE
);

INSERT INTO posts(id, creator_id, content)
VALUES
    ('p001', 'u003', 'olá, ganhamos o premio de 05/08/2023'),
    ('p002', 'u003', 'olá, O SENHOR é conosco');

CREATE TABLE likes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    Foreign Key (user_id) REFERENCES users(id),
   -- ON UPDATE CASCADE
   -- ON DELETE CASCADE,
    Foreign Key (post_id) REFERENCES posts(id)
   -- ON UPDATE CASCADE
   -- ON DELETE CASCADE
);

INSERT INTO likes(user_id, post_id, like)
VALUES
    ('u001', 'p001', 1),
    ('u001', 'p002', 1),
    ('u002', 'p001', 1),
    ('u002', 'p002', 1),
    ('u003', 'p001', 1),
    ('u003', 'p002', 1);