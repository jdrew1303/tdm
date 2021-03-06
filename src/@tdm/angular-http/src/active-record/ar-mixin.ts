/* tslint:disable:max-line-length */

import { Tixin, Type } from '@tdm/tixin';
import { TDMModel, store, plugins } from '@tdm/core';
import { HttpAdapter } from '../core';

import { HttpActiveRecord, HttpActiveRecordStatic  } from './http-active-record';


/* GENERATED BY scripts/generic_codegen.js */
export function ARMixin<Model, TypeofModel>(): Type<Model & TDMModel<Model> & HttpActiveRecord> & TypeofModel & HttpActiveRecordStatic<Model> & typeof HttpActiveRecord;
export function ARMixin<Model, TypeofModel>(model: TypeofModel & Type<Model>): Type<Model & TDMModel<Model> & HttpActiveRecord> & TypeofModel & HttpActiveRecordStatic<Model> & typeof HttpActiveRecord;
export function ARMixin<Model, TypeofModel, T1, C1>(model: TypeofModel & Type<Model>, m1: C1 & Type<T1>): Type<Model & HttpActiveRecord & T1> & TypeofModel & typeof HttpActiveRecord &  HttpActiveRecordStatic<Model> & C1;
export function ARMixin<Model, TypeofModel, T1, C1, T2, C2>(model: TypeofModel & Type<Model>, m1: C1 & Type<T1>, m2: C2 & Type<T2>): Type<Model & TDMModel<Model> & HttpActiveRecord & T1 & T2> & TypeofModel & typeof HttpActiveRecord &  HttpActiveRecordStatic<Model> & C1 & C2;
export function ARMixin<Model, TypeofModel, T1, C1, T2, C2, T3, C3>(model: TypeofModel & Type<Model>, m1: C1 & Type<T1>, m2: C2 & Type<T2>, m3: C3 & Type<T3>): Type<Model & TDMModel<Model> & HttpActiveRecord & T1 & T2 & T3> & TypeofModel & typeof HttpActiveRecord &  HttpActiveRecordStatic<Model> & C1 & C2 & C3;
export function ARMixin<Model, TypeofModel, T1, C1, T2, C2, T3, C3, T4, C4>(model: TypeofModel & Type<Model>, m1: C1 & Type<T1>, m2: C2 & Type<T2>, m3: C3 & Type<T3>, m4: C4 & Type<T4>): Type<Model & TDMModel<Model> & HttpActiveRecord & T1 & T2 & T3 & T4> & TypeofModel & typeof HttpActiveRecord &  HttpActiveRecordStatic<Model> & C1 & C2 & C3 & C4;
export function ARMixin<Model, TypeofModel, T1, C1, T2, C2, T3, C3, T4, C4, T5, C5>(model: TypeofModel & Type<Model>, m1: C1 & Type<T1>, m2: C2 & Type<T2>, m3: C3 & Type<T3>, m4: C4 & Type<T4>, m5: C5 & Type<T5>): Type<Model & TDMModel<Model> & HttpActiveRecord & T1 & T2 & T3 & T4 & T5> & TypeofModel & typeof HttpActiveRecord &  HttpActiveRecordStatic<Model> & C1 & C2 & C3 & C4 & C5;
export function ARMixin<Model, TypeofModel, T1, C1, T2, C2, T3, C3, T4, C4, T5, C5, T6, C6>(model: TypeofModel & Type<Model>, m1: C1 & Type<T1>, m2: C2 & Type<T2>, m3: C3 & Type<T3>, m4: C4 & Type<T4>, m5: C5 & Type<T5>, m6: C6 & Type<T6>): Type<Model & TDMModel<Model> & HttpActiveRecord & T1 & T2 & T3 & T4 & T5 & T6> & TypeofModel & typeof HttpActiveRecord &  HttpActiveRecordStatic<Model> & C1 & C2 & C3 & C4 & C5 & C6;
export function ARMixin<Model, TypeofModel, T1, C1, T2, C2, T3, C3, T4, C4, T5, C5, T6, C6, T7, C7>(model: TypeofModel & Type<Model>, m1: C1 & Type<T1>, m2: C2 & Type<T2>, m3: C3 & Type<T3>, m4: C4 & Type<T4>, m5: C5 & Type<T5>, m6: C6 & Type<T6>, m7: C7 & Type<T7>): Type<Model & TDMModel<Model> & HttpActiveRecord & T1 & T2 & T3 & T4 & T5 & T6 & T7> & TypeofModel & typeof HttpActiveRecord &  HttpActiveRecordStatic<Model> & C1 & C2 & C3 & C4 & C5 & C6 & C7;

export function ARMixin<Model, TypeofModel, TMIXIN, CMIXIN>(model?: TypeofModel & Type<Model>, ...mixins: Array<CMIXIN & Type<TMIXIN>>): Type<Model & TDMModel<Model> & HttpActiveRecord & TMIXIN> & HttpActiveRecordStatic<Model> & TypeofModel & typeof HttpActiveRecord & CMIXIN  {
  plugins.assertPlugin('ActiveRecord'); // make sure plugin attached

  model = model || <any>class {};

  /**
   * Marking the mixin HttpActiveRecord for model.
   * Since model is an extending class, it's type will be traversed and looked up for mixins
   * so the deriving class (base) will get all the actions from the HttpActiveRecord
   *
   */
  store.markMixins(model, HttpAdapter, HttpActiveRecord, ...mixins);

  // we can't send ...mixin to Tixin since the type limits the ..mixins amount
  const result = (Tixin as any)(model, HttpActiveRecord, ...mixins);

  store.buildIfReady(result, HttpAdapter);

  return result as any;
}
export type ARMixin<Model> = Model & TDMModel<Model> & HttpActiveRecord;

/* tslint:disable:max-line-length */
