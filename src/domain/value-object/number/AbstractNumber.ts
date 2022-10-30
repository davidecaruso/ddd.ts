import * as t from 'io-ts'
import { ValueObject } from '../ValueObject'

export abstract class AbstractNumber extends ValueObject {
  protected _value!: number

  get value() {
    return this._value
  }

  protected set value(n) {
    this._value = n
  }

  add<N extends this | number>(n: N): this {
    this._value = this._value + (t.number.is(n) ? n : n.value)

    return this
  }

  sub<N extends this | number>(n: N): this {
    this._value = this._value - (t.number.is(n) ? n : n.value)

    return this
  }

  mul<N extends this | number>(n: N): this {
    this._value = this._value * (t.number.is(n) ? n : n.value)

    return this
  }

  div<N extends this | number>(n: N): this {
    this._value = this._value / (t.number.is(n) ? n : n.value)

    return this
  }

  abstract equals<N extends this>(that: N): boolean
}