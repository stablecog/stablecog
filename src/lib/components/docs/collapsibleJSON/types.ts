export interface TKeyObject {
	key: string | undefined;
	value: any;
	children?: TKeyObject[];
	isNumber: boolean;
	isBoolean: boolean;
	isString: boolean;
	isObject: boolean;
	isArray: boolean;
	hasNextKey: boolean;
	isOpen: boolean;
	isParentArray: boolean;
	isParentObject: boolean;
}
