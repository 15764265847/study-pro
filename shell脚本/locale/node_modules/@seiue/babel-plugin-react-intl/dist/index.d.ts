import { SourceLocation } from '@babel/types';
interface MessageDescriptor {
    id: string;
    defaultMessage?: string;
    description?: string;
}
export declare type ExtractedMessageDescriptor = MessageDescriptor & Partial<SourceLocation> & {
    file?: string;
};
declare const _default: any;
export default _default;
