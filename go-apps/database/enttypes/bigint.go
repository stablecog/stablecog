package enttypes

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"math/big"
	"strings"
)

type BigInt struct {
	*big.Int
}

func NewBigInt(i int64) BigInt {
	return BigInt{Int: big.NewInt(i)}
}

func (b *BigInt) Scan(src any) error {
	var i sql.NullString
	if err := i.Scan(src); err != nil {
		return err
	}
	if !i.Valid {
		return nil
	}
	if b.Int == nil {
		b.Int = big.NewInt(0)
	}
	// Value came in a floating point format.
	if strings.ContainsAny(i.String, ".+e") {
		f := big.NewFloat(0)
		if _, err := fmt.Sscan(i.String, f); err != nil {
			return err
		}
		b.Int, _ = f.Int(b.Int)
	} else if _, err := fmt.Sscan(i.String, b.Int); err != nil {
		return err
	}
	return nil
}

func (b BigInt) Value() (driver.Value, error) {
	return b.String(), nil
}

func (b BigInt) Add(c BigInt) BigInt {
	b.Int = b.Int.Add(b.Int, c.Int)
	return b
}
