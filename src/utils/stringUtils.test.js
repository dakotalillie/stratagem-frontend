import {
  camelCaseObjectProperties, camelCaseArrayItems, convertToCamelCase,
  capitalize
} from './stringUtils';

describe('capitalize', () => {
  it('capitalizes a string', () => {
    expect(capitalize('hello')).toEqual('Hello');
  })
});

describe('convertToCamelCase', () => {
  it('converts a string formatted with underscores to camel case', () => {
    expect(convertToCamelCase('hello_world')).toEqual('helloWorld');
  })
});

describe('camelCaseObjectProperties', () => {
  it('converts object properties to camel case', () => {
    const obj = { hello_world: 'foobar' }
    expect(camelCaseObjectProperties(obj)).toEqual({ helloWorld: 'foobar' })
  });
  it('can work with nested objects', () => {
    const nested_obj = { hello_world: { foo_bar: true} };
    expect(camelCaseObjectProperties(nested_obj)).toEqual(
      { helloWorld: { fooBar: true } }
    );
  });
  it('can work with nested arrays', () => {
    const obj = { hello_world: [{ nested_obj: true }] }
    expect(camelCaseObjectProperties(obj)).toEqual(
      { helloWorld: [{ nestedObj: true }] }
    );
  })
});

describe('camelCaseArrayItems', () => {
  it('can work with nested objects', () => {
    const arr = [{hello_world: true}]
    expect(camelCaseArrayItems(arr)).toEqual([{helloWorld: true}]);
  });
  it('can work with nested arrays', () => {
    const arr = [[{hello_world: true}]]
    expect(camelCaseArrayItems(arr)).toEqual(
      [[{ helloWorld: true }]]
    );
  })
});