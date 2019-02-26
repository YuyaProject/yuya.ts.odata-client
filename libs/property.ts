export interface IProperty {
  name: string;
}


export function isIProperty(val: any): val is IProperty {
  const vproperty = val as IProperty;
  return !!vproperty && vproperty.name !== undefined;
}
