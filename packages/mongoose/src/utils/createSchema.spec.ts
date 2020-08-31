import {CollectionOf, Default, Enum, Maximum, MaxLength, Minimum, MinLength, Pattern, Property, Name, Required} from "@tsed/common";
import {expect} from "chai";
import {Schema as SchemaMongoose} from "mongoose";
import {OpenApiModelSchemaBuilder} from "../../../swagger/src/class/OpenApiModelSchemaBuilder";
import {Model, ObjectID, Ref, Schema, VirtualRef} from "../../src/decorators";
import {SchemaIgnore} from "../../src/decorators/schemaIgnore";
import {getSchema} from "../../src/utils/createSchema";

describe("createSchema", () => {
  it("should create schema", () => {
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    // GIVEN
    @Model()
    class Test {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    // WHEN
    const result = getSchema(Test);

    // THEN
    expect(result.obj).to.deep.eq({
      enum: {
        enum: ["v1", "v2"],
        required: false,
        type: String
      },
      name: {
        default: "defaultValue",
        match: /pattern/,
        maxlength: 100,
        minlength: 0,
        required: false,
        type: String
      },
      test: {
        max: 10,
        min: 0,
        required: false,
        type: Number
      }
    });
  });
  it("should create schema with required property", () => {
    // GIVEN
    @Model()
    class Test2 {
      @Required()
      test: string;
    }

    // WHEN
    const result = getSchema(Test2);

    // THEN
    expect(result.obj.test.required).to.be.a("function");
  });
  it("should create schema with subdocument", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Schema()
    class Children {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test3 {
      @Property()
      test: Children;
    }

    // WHEN
    const testSchema = getSchema(Test3);
    const childrenSchema = getSchema(Children);

    // THEN
    expect(testSchema.obj).to.deep.eq({
      test: {
        type: childrenSchema,
        required: false
      }
    });

    expect(childrenSchema.obj).to.deep.eq({
      enum: {
        enum: ["v1", "v2"],
        required: false,
        type: String
      },
      name: {
        default: "defaultValue",
        match: /pattern/,
        maxlength: 100,
        minlength: 0,
        required: false,
        type: String
      },
      test: {
        max: 10,
        min: 0,
        required: false,
        type: Number
      }
    });
  });
  it("should create schema with ref", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Model()
    class Children {
      @ObjectID("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test4 {
      @Ref(Children)
      test: Ref<Children>;
    }

    // WHEN
    const testSchema = getSchema(Test4);
    const childrenSchema = getSchema(Children);

    // THEN
    expect(testSchema.obj).to.deep.eq({
      test: {
        type: SchemaMongoose.Types.ObjectId,
        ref: "Children",
        required: false
      }
    });

    expect(childrenSchema.obj).to.deep.eq({
      enum: {
        enum: ["v1", "v2"],
        required: false,
        type: String
      },
      name: {
        default: "defaultValue",
        match: /pattern/,
        maxlength: 100,
        minlength: 0,
        required: false,
        type: String
      },
      test: {
        max: 10,
        min: 0,
        required: false,
        type: Number
      }
    });

    const result = new OpenApiModelSchemaBuilder(Test4).build();

    expect(result).to.deep.eq({
      _definitions: {
        Test4: {
          properties: {
            test: {
              description: "Mongoose Ref ObjectId",
              example: "5ce7ad3028890bd71749d477",
              type: "string"
            }
          },
          type: "object"
        }
      },
      _responses: {},
      _schema: {
        properties: {
          test: {
            description: "Mongoose Ref ObjectId",
            example: "5ce7ad3028890bd71749d477",
            type: "string"
          }
        },
        type: "object"
      },
      target: Test4
    });
  });
  it("should create schema with virtual ref", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Model()
    class Children2 {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test5 {
      @VirtualRef({ref: Children2, foreignField: "foo"})
      test: VirtualRef<Children2>;
    }

    // WHEN
    const testSchema: any = getSchema(Test5);

    // THEN
    expect(testSchema.obj).to.deep.eq({});
    expect(testSchema.virtuals.test.options).to.deep.includes({
      foreignField: "foo",
      justOne: true,
      localField: "_id",
      options: undefined,
      ref: "Children2"
    });
  });
  it("should create schema with collection (Array of subdocument)", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Schema()
    class Children {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test6 {
      @CollectionOf(Children)
      tests: Children[];
    }

    // WHEN
    const testSchema = getSchema(Test6);
    const childrenSchema = getSchema(Children);

    // THEN
    expect(testSchema.obj).to.deep.eq({
      tests: [
        {
          type: childrenSchema,
          required: false
        }
      ]
    });

    expect(childrenSchema.obj).to.deep.eq({
      enum: {
        enum: ["v1", "v2"],
        required: false,
        type: String
      },
      name: {
        default: "defaultValue",
        match: /pattern/,
        maxlength: 100,
        minlength: 0,
        required: false,
        type: String
      },
      test: {
        max: 10,
        min: 0,
        required: false,
        type: Number
      }
    });
  });
  it("should create schema with collection (Array of ref)", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Model()
    class Children3 {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test7 {
      @Ref(Children3)
      tests: Ref<Children3>[];
    }

    // WHEN
    const testSchema = getSchema(Test7);

    // THEN
    expect(testSchema.obj).to.deep.eq({
      tests: [
        {
          type: SchemaMongoose.Types.ObjectId,
          ref: "Children3",
          required: false
        }
      ]
    });
  });
  it("should create schema with collection (Array of virtual ref", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Model()
    class Children4 {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test8 {
      @VirtualRef({type: Children4, foreignField: "foo"})
      tests: VirtualRef<Children4>[];
    }

    // WHEN
    const testSchema = getSchema(Test8);

    // THEN
    expect(testSchema.obj).to.deep.eq({});
    // @ts-ignore
    expect(testSchema.virtuals.tests.options).to.deep.includes({
      foreignField: "foo",
      justOne: false,
      localField: "_id",
      options: undefined,
      ref: "Children4"
    });
  });
  it("should create schema with collection (Map of subdocument)", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    @Schema()
    class Children {
      @Name("id")
      _id: string;

      @Minimum(0)
      @Maximum(10)
      test: number;

      @MinLength(0)
      @MaxLength(100)
      @Pattern("pattern")
      @Default("defaultValue")
      name: string = "defaultValue";

      @Enum(MyEnum)
      enum: MyEnum;
    }

    @Model()
    class Test9 {
      @CollectionOf(Children)
      tests: Map<string, Children>;
    }

    // WHEN
    const testSchema = getSchema(Test9);
    const childrenSchema = getSchema(Children);

    // THEN
    expect(testSchema.obj).to.deep.eq({
      tests: {
        type: Map,
        of: {
          type: childrenSchema,
          required: false
        }
      }
    });

    expect(childrenSchema.obj).to.deep.eq({
      enum: {
        enum: ["v1", "v2"],
        required: false,
        type: String
      },
      name: {
        default: "defaultValue",
        match: /pattern/,
        maxlength: 100,
        minlength: 0,
        required: false,
        type: String
      },
      test: {
        max: 10,
        min: 0,
        required: false,
        type: Number
      }
    });
  });
  it("should throw error with collection (Set of subdocument)", () => {
    // GIVEN
    enum MyEnum {
      V1 = "v1",
      V2 = "v2"
    }

    let actualError: any;
    try {
      @Schema()
      class Children {
        @Name("id")
        _id: string;

        @Minimum(0)
        @Maximum(10)
        test: number;

        @MinLength(0)
        @MaxLength(100)
        @Pattern("pattern")
        @Default("defaultValue")
        name: string = "defaultValue";

        @Enum(MyEnum)
        enum: MyEnum;
      }

      @Model()
      class Test9 {
        @CollectionOf(Children)
        tests: Set<Children>;
      }
    } catch (er) {
      actualError = er;
    }

    expect(actualError).to.instanceof(Error);
    expect(actualError.message).to.eq("Invalid collection type. Set is not supported.");
  });
  it("should not create schema property for ignored field", () => {
    @Model()
    class Test10 {
      @Property()
      field: string;
      @Property()
      @SchemaIgnore()
      kind: string;
    }

    const testSchema = getSchema(Test10);
    expect(testSchema.obj).to.deep.eq({
      field: {
        required: false,
        type: String
      }
    });
  });
});
