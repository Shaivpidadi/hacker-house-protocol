import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { CoPayersSet } from "../generated/schema"
import { CoPayersSet as CoPayersSetEvent } from "../generated/HackerHouseProtocol/HackerHouseProtocol"
import { handleCoPayersSet } from "../src/hacker-house-protocol"
import { createCoPayersSetEvent } from "./hacker-house-protocol-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let reservationId = BigInt.fromI32(234)
    let payers = [
      Address.fromString("0x0000000000000000000000000000000000000001")
    ]
    let bps = [123]
    let newCoPayersSetEvent = createCoPayersSetEvent(reservationId, payers, bps)
    handleCoPayersSet(newCoPayersSetEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("CoPayersSet created and stored", () => {
    assert.entityCount("CoPayersSet", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CoPayersSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "reservationId",
      "234"
    )
    assert.fieldEquals(
      "CoPayersSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "payers",
      "[0x0000000000000000000000000000000000000001]"
    )
    assert.fieldEquals(
      "CoPayersSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "bps",
      "[123]"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
