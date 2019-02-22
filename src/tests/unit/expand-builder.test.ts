import { ExpandBuilder } from '../../libs/expand-builder';

describe('expand-builder tests', () => {
  // #region method : constructor
  it('constructor empty parameter', () => {
    expect(() => new ExpandBuilder('')).toThrow('property name is null or empty');
  });
  it('constructor non-empty parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo');
  });
  // #endregion

  // #region method : addColumn
  it('addColumn empty parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addColumn('');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo');
  });

  it('addColumn non-empty parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addColumn('id');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo($select=id)');
  });

  it('addColumn multiple columns separate with ,', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addColumn('id,name');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo($select=id,name)');
  });

  it('addColumn non-empty duplicate parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addColumn('id');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo($select=id)');

    expandBuilder.addColumn('id');
    expect(expandBuilder.toString()).toEqual('demo($select=id)');
  });
  // #endregion

  // #region method : addColumns
  it('addColumns undefined parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addColumns();
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo');
  });

  it('addColumns empty parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addColumns('');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo');
  });

  it('addColumns empty two parameters', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addColumns('', '');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo');
  });

  it('addColumns non-empty one parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addColumns('id');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo($select=id)');
  });

  it('addColumns non-empty two columns', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addColumns('id', 'name');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo($select=id,name)');
  });

  it('addColumns non-empty duplicate parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addColumns('id');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo($select=id)');

    expandBuilder.addColumns('id');
    expect(expandBuilder.toString()).toEqual('demo($select=id)');

    expandBuilder.addColumns('id', 'name');
    expect(expandBuilder.toString()).toEqual('demo($select=id,name)');
  });
  // #endregion

  // #region method : setFilter
  it('setFilter undefined parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.setFilter();
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo');
  });
  it('setFilter empty parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.setFilter('');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo');
  });
  it('setFilter empty two parameters', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.setFilter('', '');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo');
  });
  it('setFilter non-empty parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.setFilter('id eq 5');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo($filter=id eq 5)');
  });
  it('setFilter non-empty two parameters', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.setFilter('id eq 5', 'name lt "c"');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo($filter=(id eq 5)and(name lt "c"))');
  });
  // #endregion

  // #region method : setOrderBy
  it('setOrderBy undefined parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.setOrderBy();
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo');
  });
  it('setOrderBy empty parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.setOrderBy('');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo');
  });
  it('setOrderBy empty two parameters', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.setOrderBy('', '');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo');
  });
  it('setOrderBy non-empty parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.setOrderBy('id');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo($orderby=id)');
  });
  it('setOrderBy non-empty two parameters', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.setOrderBy('id', 'name');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo($orderby=id,name)');
  });
  // #endregion

  // #region method : addExpand
  it('addExpand undefined parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addExpand();
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo');
  });
  it('addExpand non-empty parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addExpand(new ExpandBuilder('demo2'));
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo($expand=demo2)');
  });
  it('addExpand non-empty two parameters', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addExpand(new ExpandBuilder('demo2'), new ExpandBuilder('demo3'));
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo($expand=demo2,demo3)');
  });
  // #endregion

  // #region method : addExpand
  it('addExpand undefined parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addExpand();
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo');
  });
  it('addExpand non-empty parameter', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addExpand(new ExpandBuilder('demo2'));
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo($expand=demo2)');
  });
  it('addExpand non-empty two parameters', () => {
    const expandBuilder = new ExpandBuilder('demo');
    expandBuilder.addExpand(new ExpandBuilder('demo2'), new ExpandBuilder('demo3'));
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('demo');
    expect(expandBuilder.toString()).toEqual('demo($expand=demo2,demo3)');
  });
  // #endregion

  // #region method : addExpandFromString
  it('addExpandFromString empty parameter', () => {
    const expandBuilder = new ExpandBuilder('category');
    expandBuilder.addExpandFromString(String());
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('category');
    expect(expandBuilder.toString()).toEqual('category');
  });
  it('addExpandFromString non-empty parameter(one level)', () => {
    const expandBuilder = new ExpandBuilder('category');
    expandBuilder.addExpandFromString('id');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('category');
    expect(expandBuilder.toString()).toEqual('category($select=id)');
  });
  it('addExpandFromString non-empty parameter(root)', () => {
    const expandBuilder = new ExpandBuilder('category');
    expandBuilder.addExpandFromString('category');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('category');
    expect(expandBuilder.toString()).toEqual('category');
  });
  it('addExpandFromString non-empty parameter(one level with root)', () => {
    const expandBuilder = new ExpandBuilder('category');
    expandBuilder.addExpandFromString('category.id');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('category');
    expect(expandBuilder.toString()).toEqual('category($select=id)');
  });
  it('addExpandFromString non-empty parameter(two levels)', () => {
    const expandBuilder = new ExpandBuilder('category');
    expandBuilder.addExpandFromString('products.id');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('category');
    expect(expandBuilder.toString()).toEqual('category($expand=products($select=id))');
  });
  it('addExpandFromString non-empty parameter(two levels with root)', () => {
    const expandBuilder = new ExpandBuilder('category');
    expandBuilder.addExpandFromString('category.products.id');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('category');
    expect(expandBuilder.toString()).toEqual('category($expand=products($select=id))');
  });
  it('addExpandFromString non-empty parameter(three levels)', () => {
    const expandBuilder = new ExpandBuilder('category');
    expandBuilder.addExpandFromString('products.orders.id');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('category');
    expect(expandBuilder.toString()).toEqual('category($expand=products($expand=orders($select=id)))');
  });
  it('addExpandFromString non-empty parameter(three levels with root)', () => {
    const expandBuilder = new ExpandBuilder('category');
    expandBuilder.addExpandFromString('category.products.orders.id');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('category');
    expect(expandBuilder.toString()).toEqual('category($expand=products($expand=orders($select=id)))');
  });
  it('addExpandFromString non-empty parameter(two levels) multiple call', () => {
    const expandBuilder = new ExpandBuilder('category');
    expandBuilder.addExpandFromString('products.id');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('category');
    expect(expandBuilder.toString()).toEqual('category($expand=products($select=id))');

    expandBuilder.addExpandFromString('products.name');
    expect(expandBuilder.toString()).toEqual('category($expand=products($select=id,name))');
  });
  it('addExpandFromString non-empty parameter(three levels) multiple call', () => {
    const expandBuilder = new ExpandBuilder('category');
    expandBuilder.addExpandFromString('products.orders.id');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('category');
    expect(expandBuilder.toString()).toEqual('category($expand=products($expand=orders($select=id)))');

    expandBuilder.addExpandFromString('products.orders.date');
    expect(expandBuilder.toString()).toEqual('category($expand=products($expand=orders($select=id,date)))');
  });
  it('addExpandFromString non-empty parameter(two and three levels) multiple call', () => {
    const expandBuilder = new ExpandBuilder('category');
    expandBuilder.addExpandFromString('products.id');
    expect(expandBuilder).not.toBeNull();
    expect((expandBuilder as any).propertyName).toEqual('category');
    expect(expandBuilder.toString()).toEqual('category($expand=products($select=id))');

    expandBuilder.addExpandFromString('products.orders.id');
    expect(expandBuilder.toString()).toEqual('category($expand=products($expand=orders($select=id);$select=id))');
  });
  // #endregion
});
