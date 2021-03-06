import { Observable } from 'rxjs/Observable';
import { RequestOptions, Response, URLSearchParams, Headers } from '@angular/http';
import { isUndefined, stringify, TargetMetadata } from '@tdm/transformation';

import {
  Adapter,
  findProp,
  ExecuteContext,
  ExecuteResponse
} from '@tdm/core';

import { HttpActionMetadata, UrlParamMetadata } from '../metadata';

import { HttpActionOptions, TrailingSlashesStrategy } from './interfaces';
import { httpDefaultConfig } from '../http-default-config';
import { Params, getParamNames, formatPattern } from '../utils/match-pattern';

import { getHttp } from '../providers';

const EMPTY_META: TargetMetadata = <any>{};

export class HttpAdapter implements Adapter<HttpActionMetadata, HttpActionOptions> {

  execute(ctx: ExecuteContext<HttpActionMetadata>, options: HttpActionOptions): Observable<ExecuteResponse> {
    const http = getHttp();

    if (!options) options = {} as any;
    let {action} = ctx;
    let resource = ctx.targetMeta || EMPTY_META;

    const url = findProp('endpoint', resource, action);
    if (!url) {
      // TODO: move to @tdm error with more info.
      throw new Error('Invalid endpoint, no endpoint found.')
    }

    const withCredentials = findProp('withCredentials', httpDefaultConfig, resource, action, options);
    const strip = findProp('trailingSlashes', httpDefaultConfig, resource, action, options);

    const urlParams = this.getParams(ctx, resource, options);

    const {path, query} = this.splitParams(url, urlParams);

    const requestOptions = new RequestOptions({
      url: processUrl(this.parseUrl(url, path), strip),
      method: action.methodInfo.source as any,
      search: this.paramsToSearchParams(query),
      headers: this.getHeaders(ctx, resource, options),
      body: ctx.body,
      withCredentials
    });

    return http.request(requestOptions.url, requestOptions)
      .map(response => ({data: response.json(), response, request: requestOptions}));
  }

  protected getHeaders(ctx: ExecuteContext<HttpActionMetadata>, meta: TargetMetadata, options: HttpActionOptions): Headers {
    const headers = new Headers(findProp('headers', httpDefaultConfig, meta, ctx.action));
    if (options.headers) {
      Object.keys(options.headers).forEach(k => {
        if (isUndefined(options.headers[k])) {
          headers.delete(k);
        } else {
          headers.set(k, options.headers[k])
        }
      })
    }
    return headers;
  }

  protected getParams(ctx: ExecuteContext<HttpActionMetadata>, meta: TargetMetadata, options: HttpActionOptions): Params {
    const params = Object.assign({}, findProp('urlParams', httpDefaultConfig, meta, ctx.action));

    if (meta !== EMPTY_META && ctx.instance) {
      // we don't care about the keys (properties) UrlParam is on...
      // TODO: change how UrlParams are stored, instead of target->UrlParamMetadata->propName->Set<UrlParamMetadata>
      // store everything in one set/array to avoid this messy extraction.
      // an alternative is to cache the flattened array.
      const boundParams = meta
        .getValues<any, Set<UrlParamMetadata>>(UrlParamMetadata)
        .reduce( (arr, set) => arr.concat(Array.from(set)) , [] as UrlParamMetadata[]);

      for (let i = 0, len = boundParams.length; i < len; i++) {
        const bp = boundParams[i];
        if (bp.methods.length === 0 || bp.methods.some(mi => mi.method === ctx.action.method)) {
          params[bp.urlTemplateParamName] = ctx.instance[bp.name];
        }
      }
    }

    if (options.urlParams) {
      Object.assign(params, options.urlParams);
    }

    return params;
  }

  protected parseUrl(url: string, params: Params): string {
    try {
      return formatPattern(url, params)
    }
    catch (e) {
      throw new Error(`URL Parameter Error in ${stringify(this.constructor)}: ${e.message}`);
    }
  }

  /**
   * From a collection of parameters return those belong to the url (path) and those that are not (query).
   * @param url
   * @param params
   * @returns {{path: {}, query: {}}}
   */
  protected splitParams(url: string, params: Params): {path: Params, query: Params} {
    const pathParamNames = getParamNames(url);

    return Object.keys(params)
      .reduce((splitParams, key) => {
        if (!isUndefined(params[key])) {
          if (pathParamNames.indexOf(key) === -1) {
            splitParams.query[key] = params[key];
          } else {
            splitParams.path[key] = params[key];
          }
        }
        return splitParams;
      }, {path: {}, query: {}});

  }

  private paramsToSearchParams(params: Params): URLSearchParams {
    return Object.keys(params)
      .reduce((search, key) => {
        const value = params[key];
        if (Array.isArray(value)) {
          value.forEach(q => search.append(key, q));

        } else {
          search.append(key, value);
        }
        return search;
      }, new URLSearchParams());
  }
}

function processUrl(url: string, slashes: TrailingSlashesStrategy): string {
  switch (slashes) {
    case 'strip':
      url = url.replace(/\/+$/, '') || '/';
      break;
    case 'force':
      if (url[url.length - 1] !== '/') {
        url += '/';
      }
      break;
    default:
      break;
  }

  // E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
  return url.replace(/\/\.(?=\w+($|\?))/, '.')
    .replace(/\/\\\./, '/.'); // replace escaped `/\.` with `/.`
}
