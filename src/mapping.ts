import type { Mapping } from '@graphprotocol/hypergraph/mapping';
import { Id } from '@graphprotocol/hypergraph';

export const mapping: Mapping = {
  Image: {
    typeIds: [Id("ba4e4146-0010-499d-a0a3-caaa7f579d0e")],
    properties: {
      url: Id("8a743832-c094-4a62-b665-0c3cc2f9c7bc")
    },
  },
  Hacker: {
    typeIds: [Id("c2e78974-2aa0-4c7e-a579-2322561b8d31")],
    properties: {
      name: Id("dabfef20-5561-47a2-8b38-4fa1e397ffe2"),
      walletAddress: Id("5ed0778a-b559-4a27-ab9e-a6fc400f94c9"),
      githubUrl: Id("54a01308-19a1-49c2-a001-a7e7e7b1f038"),
      twitterUrl: Id("cd76fed7-c351-434d-9db7-88647fd57763")
    },
    relations: {
      avatar: Id("db16155b-fa74-40c0-a216-aae3ff7b5c85")
    },
  },
  Property: {
    typeIds: [Id("a7028418-4c58-4abe-bc11-e333e34e215e")],
    properties: {
      name: Id("b54be3b3-16e9-4768-ba32-bf29bd5fbd54"),
      description: Id("3f9077be-8519-4268-9edc-25918a3a2c71"),
      location: Id("fd3eed7c-a92b-401b-95e3-44eca0cb61c7"),
      price: Id("1ad12b69-1f5b-4313-91cf-f171c59eb716"),
      size: Id("b1251ac4-3122-4120-89a6-0c168bbf5f81"),
      bedrooms: Id("abdfd559-253b-4617-a751-aa3d4a04c60a"),
      bathrooms: Id("b3b899cf-4a7a-485d-949e-39228863c8bb"),
      parking: Id("4ec11aa7-c919-4f6d-a885-7b0b8c9d6868"),
      amenities: Id("8fd740a7-fa70-47c2-8a7c-f2ced922462f"),
      wifi: Id("69b0edf3-3a31-4b6b-8bd0-ba476f146f78"),
      features: Id("c67bedaa-07c4-4c4c-8101-a86e78922e72"),
      status: Id("41d978f3-a925-4527-8c5d-831f3623a5d4"),
      type: Id("763a37cb-f172-4659-890c-f1ea52240a53"),
      deposit: Id("9fb2adc0-a58c-487d-ae6d-199ca1a23455")
    },
    relations: {
      image: Id("b1d66889-b451-45b9-a268-3e36589c9819")
    },
  },
  Landlord: {
    typeIds: [Id("ccc5f4c0-6c64-4eab-8c12-212e093bb52d")],
    properties: {
      name: Id("1258a851-9e1c-426c-b7f4-a6a3c2e418f5"),
      walletAddress: Id("57280f66-d9d9-4d1b-8c72-ac8b2e0c2152"),
      verified: Id("ab8d6236-ebbe-4ab5-95ed-c05240aee538")
    },
    relations: {
      avatar: Id("823b0f4f-a7be-4485-9926-97792205b1af")
    },
  },
  City: {
    typeIds: [Id("d229d85d-c16e-48da-8715-d27b132baf81")],
    properties: {
      name: Id("700ba0c5-280f-4d44-a544-9b051ea3a886"),
      description: Id("18182568-5ef1-455b-aa3e-e9dc7d94e297")
    },
    relations: {
      image: Id("3837570b-3888-420b-bc02-f5b4401bff9f")
    },
  },
  Country: {
    typeIds: [Id("c0aab78e-dcd5-49a1-a6e2-f1ee20f666ab")],
    properties: {
      name: Id("f0fbbb0e-65d6-436f-8d18-1bc5a8eff65c"),
      description: Id("334f0b4a-c9ca-42bc-9a60-e35b5a92e7ff")
    },
    relations: {
      image: Id("b76fe98e-583c-4665-a7c9-2d1465030cf9")
    },
  },
  Event: {
    typeIds: [Id("b8b642ea-8de5-4b68-acb9-13ccd845d5ce")],
    properties: {
      name: Id("ccc7d2d2-1a31-4771-821a-c4353b42781c"),
      description: Id("ca2bda5a-c0e0-4b14-a3e1-3f633b421306"),
      startDate: Id("010950da-07fd-4122-849d-8189534d0831"),
      endDate: Id("3df8e5cd-7b62-47eb-9cf0-6b2ebae94d53"),
      organizer: Id("f8f8144c-cc66-4100-a4f2-986cf18e4d6d")
    },
    relations: {
      image: Id("ac550a38-3b84-42d1-bb33-c1aedb065501")
    },
  },
  Booking: {
    typeIds: [Id("3b923cfd-ac36-412a-901f-66edc44ecb13")],
    properties: {
      checkIn: Id("c9cdcf21-dfe9-49b6-9706-0018f0729af4"),
      checkOut: Id("a935c74f-23d3-4476-9211-b09156e387ec"),
      status: Id("897624dd-c845-426b-b55a-5ba8b6d79fe0"),
      totalPrice: Id("fe3d6f33-8e5d-4e7a-8ad7-c4fcf232d3dc"),
      deposit: Id("8542ddf9-ac67-4ee4-9d6c-b2cd544b3773"),
      guestCount: Id("18c4a31a-01c0-4786-9483-395bc3d71e32"),
      paymentStatus: Id("c884edc6-ed76-4fa3-a495-a89339aee834"),
      paymentDate: Id("913689a3-64f5-4740-97e9-e0c8d9017f36"),
      paymentAmount: Id("4b2fb54a-02dd-48cd-a0b6-f2fa99773365"),
      paymentCurrency: Id("b9486a96-c9ac-4dcd-b59c-743dbacde40d"),
      notes: Id("b173c072-13ef-4b41-88b8-f5fbe658d43d"),
      createdAt: Id("d4337553-d572-4ec2-a61e-a14f3ff4a58d"),
      updatedAt: Id("4b8bc61d-ce1a-4634-9489-09251dafa618"),
      cancelledAt: Id("aa6b2076-e80a-4636-aeb8-c164a8c196e3"),
      cancelledBy: Id("893df5ea-e896-4741-81de-e181a5c984ff"),
      cancelledReason: Id("7f0699b6-bd10-44b1-9f65-af5d04f27512"),
      cancelledNotes: Id("7203b2c7-0cf6-4bfa-8592-4e1ca5b83be4")
    },
    relations: {
      property: Id("9c8f0a3f-2e86-452e-a17e-c76a47f21167"),
      hackers: Id("c5cf570a-74dc-45ea-8b51-e6d379c4cd0b"),
      landlord: Id("a9fd56c8-9c7c-4790-9479-1c3aba1c39b2")
    },
  },
  Review: {
    typeIds: [Id("9ae0fbdb-3ecf-444a-928c-29028a8146cb")],
    properties: {
      rating: Id("6f8b88fa-1a20-4849-9dac-856027d29ff9"),
      comment: Id("1414f1c4-19c0-4837-b441-230b6dbd06f9"),
      createdAt: Id("878663f0-bef6-488a-888d-61681e61e49d")
    },
  },
  BookingPayment: {
    typeIds: [Id("0e146341-0309-45c5-bfd7-e06270fc65d1")],
    properties: {
      amount: Id("d97aced2-76e1-4856-b256-80ae78f37fc7"),
      securityDeposit: Id("0ad1edce-18ef-40cb-b4b5-324faa3020fc"),
      paymentStatus: Id("a9afc38b-083f-486e-aef7-55120a21d1cc"),
      paymentDate: Id("17dc48dd-8e4c-4be5-8de5-80fb56fa9660"),
      walletAddress: Id("8903d7c5-be20-4dc5-b11a-e0f048b8182b"),
      transactionHash: Id("644fa247-4264-467d-89de-d1c5ae8e3c08")
    },
  },
  HackerGroup: {
    typeIds: [Id("ca118184-c0eb-4b61-a02e-6c9dba8028b4")],
    properties: {
      name: Id("cc71564f-79a9-4d7c-ba1c-6d389096368f"),
      description: Id("42738d95-3a86-4f11-8528-5fd49b401497")
    },
    relations: {
      image: Id("0444e05f-c07b-488b-ac56-e056f084d08d")
    },
  },
  EscrowContract: {
    typeIds: [Id("9d6e7554-c5fe-47eb-8364-467ffaa6f191")],
    properties: {
      contractAddress: Id("0a8b9767-3f4a-4049-ae15-85afcbb3a7f9"),
      totalAmount: Id("b2dc11a3-2c4f-4bdb-a5f5-1e754c95d717"),
      securityDeposit: Id("8831634c-dfb2-424e-a991-af5db38576a0"),
      status: Id("f4c78c27-9c92-42f9-ac23-d441279a704a"),
      dateCreated: Id("ceb98fde-e34f-4196-835e-54dc77e82a28"),
      dateReleased: Id("023923a8-07ef-4608-b8aa-d9a03222fb34")
    },
  },
}