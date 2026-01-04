package helpers

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"

	"check-in/api/internal/constants"
)

func CheckTime(t *testing.T, expected time.Time, actual time.Time) {
	expectedHour := expected.Hour()

	// check with some margin, to take into account possible minute differences
	assert.True(t,
		actual.Hour() == expectedHour ||
			actual.Hour() == expectedHour-1 ||
			(actual.Hour() == 23 && expectedHour == 0),
	)
	assert.Equal(
		t,
		expected.Format(constants.DateFormat),
		actual.Format(constants.DateFormat),
	)
}
