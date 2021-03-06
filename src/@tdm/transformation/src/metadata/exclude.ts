import {
  MapExt,
  TransformDir,
  BaseMetadata,
  DecoratorInfo,
  MetaFactoryInstance,
  registerFactory,
  decoratorInfo,
  ensureTargetIsType
} from '../fw';

import { ClassMetadata } from './class-metadata';

export interface ExcludeMetadataArgs {
  /**
   * The type of transformation to exclude from, if not set excludes from all.
   * @optional
   * @default undefined (all)
   */
  from?: TransformDir;
}

export class ExcludeMetadata extends BaseMetadata {
  from?: TransformDir;

  constructor(obj: ExcludeMetadataArgs | undefined, info: DecoratorInfo) {
    super(info);

    if (obj) {
      this.from = obj.from;
    }

  }

  static metaFactory(metaArgs: ExcludeMetadataArgs, target: Object | Function, key: PropertyKey, desc?: PropertyDescriptor): MetaFactoryInstance<ExcludeMetadata> {
    const info = decoratorInfo(target, key, desc);
    const type = ensureTargetIsType(target);
    if (info.isStatic) {
      return {
        info,
        target: type,
        metaClassKey: ClassMetadata,
        metaPropKey: 'transformStrategy',
        metaValue: 'exclusive'
      } as any
    } else {
      return {
        info,
        target: type,
        metaClassKey: ExcludeMetadata,
        metaPropKey: info.name,
        metaValue: new ExcludeMetadata(metaArgs, info)
      }
    }
  }

  static register = registerFactory<ExcludeMetadata>();

  static extend(from: Map<PropertyKey, ExcludeMetadata>, to: Map<PropertyKey, ExcludeMetadata> | undefined): Map<PropertyKey, ExcludeMetadata> {
    return to
      ? MapExt.mergeInto(to, from)
      : new Map<PropertyKey, ExcludeMetadata>(from.entries())
    ;
  }
}
