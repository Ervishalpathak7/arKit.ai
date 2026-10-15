CREATE TABLE generations (
    id                UUID                  PRIMARY KEY ,
    description       VARCHAR(1000)         NOT NULL,
    description_hash  VARCHAR(64)           NOT NULL UNIQUE,
    graph             JSONB                 NOT NULL,
    created_at        TIMESTAMPTZ           NOT NULL DEFAULT NOW()
);

