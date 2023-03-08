import { either } from 'fp-ts'
import { InvalidNumberGivenError } from '../../../error'
import { UnsignedDecimal } from './UnsignedDecimal'
import { UnsignedInteger } from './UnsignedInteger'

const error = new InvalidNumberGivenError('The value must be greater than or equal to 0')

class Foo extends UnsignedDecimal {
  readonly _type = 'foo'

  static codec() {
    return super.codec()
  }
}

describe('UnsignedDecimal', () => {
  describe('constructor', () => {
    describe('with number input argument', () => {
      describe('with integer input argument', () => {
        describe('with positive integer input argument', () => {
          it.each([0, 42, 100])('should return a Foo instance', value => {
            const sut = new Foo(value)

            expect(sut._type).toStrictEqual('foo')
            expect(sut.value).toStrictEqual(value)
          })
        })

        describe('with negative integer input argument', () => {
          it('should throw an error', () => {
            expect(() => new Foo(-42)).toThrowError(error)
          })
        })
      })

      describe('with decimal input argument', () => {
        describe('with positive decimal input argument', () => {
          it.each([0.1, 42.1, 100.1])('should return a Foo instance', value => {
            const sut = new Foo(value)

            expect(sut._type).toStrictEqual('foo')
            expect(sut.value).toStrictEqual(value)
          })
        })

        describe('with negative decimal input argument', () => {
          it.each([-0.1, -42.1, -100.1])('should throw an error', value => {
            expect(() => new Foo(value)).toThrowError(error)
          })
        })
      })
    })

    describe('with number as string input argument', () => {
      describe('with integer input argument', () => {
        describe('with positive integer input argument', () => {
          it.each([0, 42, 100])('should return a Foo instance', value => {
            const sut = new Foo(`${value}`)

            expect(sut._type).toStrictEqual('foo')
            expect(sut.value).toStrictEqual(value)
          })
        })

        describe('with negative integer input argument', () => {
          it('should throw an error', () => {
            expect(() => new Foo(`-42`)).toThrowError(error)
          })
        })
      })

      describe('with decimal input argument', () => {
        describe('with positive decimal input argument', () => {
          it.each([0.1, 42.1, 100.1])('should return a Foo instance', value => {
            const sut = new Foo(`${value}`)

            expect(sut._type).toStrictEqual('foo')
            expect(sut.value).toStrictEqual(value)
          })
        })

        describe('with negative decimal input argument', () => {
          it.each([-0.1, -42.1, -100.1])('should throw an error', value => {
            expect(() => new Foo(`${value}`)).toThrowError(error)
          })
        })
      })
    })

    describe('with invalid input argument', () => {
      it('should throw an error', () => {
        expect(() => new Foo('foo')).toThrowError(
          new InvalidNumberGivenError('The value must be a positive number or a positive number-like string'),
        )
      })
    })
  })

  describe('equals', () => {
    describe('if Foo instances are equals', () => {
      it('should return true', () => {
        expect(new Foo(42).equals(new Foo(42))).toBeTruthy()
      })
    })

    describe('if Foo instances are not equals', () => {
      it('should return false', () => {
        expect(new Foo(42).equals(new Foo(84))).toBeFalsy()
      })
    })
  })

  describe('add', () => {
    it('should add a value to the original value', () => {
      expect(new Foo(42).add(new Foo(42)).value).toStrictEqual(84)
      expect(new Foo(42).add(new Foo(0.42)).value).toStrictEqual(42.42)
    })
  })

  describe('sub', () => {
    it('should sub a value to the original value', () => {
      expect(new Foo(42).sub(new Foo(42)).value).toStrictEqual(0)
    })
  })

  describe('mul', () => {
    it('should mul a value to the original value', () => {
      expect(new Foo(42).mul(new Foo(42)).value).toStrictEqual(1764)
    })
  })

  describe('div', () => {
    it('should div a value to the original value', () => {
      expect(new Foo(42).div(new Foo(42)).value).toStrictEqual(1)
      expect(new Foo(42).div(new Foo(84)).value).toStrictEqual(0.5)
    })
  })

  describe('codec', () => {
    describe('decode', () => {
      it('should either return an instance or not', () => {
        expect(Foo.codec().decode(42)).toStrictEqual(either.of(new Foo(42)))
        expect(Foo.codec().decode('42')).toStrictEqual(either.of(new Foo(42)))
        expect(Foo.codec().decode(new Foo(42))).toStrictEqual(either.of(new Foo(42)))
        expect(Foo.codec().decode('foo')._tag).toStrictEqual('Left')
      })
    })

    describe('encode', () => {
      it('should return the string value', () => {
        expect(Foo.codec().encode(new Foo(42))).toStrictEqual(42)
        expect(Foo.codec().encode(new Foo('42'))).toStrictEqual(42)
      })
    })

    describe('is', () => {
      it('should check if instance or not', () => {
        class Bar extends UnsignedInteger {
          readonly _type = 'bar'
        }

        expect(Foo.codec().is(new Foo(42))).toBeTruthy()
        expect(Foo.codec().is(new Bar(84))).toBeFalsy()
      })
    })
  })
})
