-- +goose Up
-- +goose StatementBegin
ALTER TABLE states
DROP CONSTRAINT IF EXISTS states_value_key;

INSERT INTO states (key, value)
VALUES ('IsMemoryProfEnabled', false);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM states
WHERE key = 'IsMemoryProfEnabled';
-- +goose StatementEnd
