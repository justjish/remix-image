/// reference types="@cloudflare/workers-types" />
// import { type KVNamespace } from '@cloudflare/workers-types/experimental'
import { Cache, CacheStatus, type CacheConfig } from "../../types/cache";
export interface KVCacheConfig extends CacheConfig {
  /**
   * cache: KV Namespace to use for caching
   */
  cache: KVNamespace;
}

export class KVCache implements Cache {
  config: KVCacheConfig;
  cache: KVNamespace;
  constructor(config: Partial<KVCacheConfig> | null | undefined = {}) {
    if (config?.cache === undefined) throw new Error("KVCache is required");
    this.cache = config?.cache;

    this.config = {
      ttl: config?.ttl ?? 24 * 60 * 60,
      tbd: config?.tbd ?? 365 * 24 * 60 * 60,
      cache: config?.cache,
    };
  }
  async get(key: string): Promise<Uint8Array | null> {
    // Fix type issue https://github.com/cloudflare/workerd/pull/369
    const v = (await this.cache.get(key, {
      type: "arrayBuffer",
      cacheTtl: this.config.ttl,
    })) as ArrayBuffer | null;
    return v === null ? v : new Uint8Array(v);
  }
  async put(key: string, resultImg: Uint8Array): Promise<void> {
    this.cache?.put(key, resultImg, { expirationTtl: this.config.ttl });
  }
  async has(key: string): Promise<boolean> {
    // KV doesn't have a has method.
    // The fastest way to check if a key exists is to try to get it as a stream.
    // If we get a stream back, we know the key exists, so we simply return and cancel the stream.
    const stream = (await this.cache.get(key, {
      type: "stream",
      cacheTtl: this.config.ttl,
    })) as ReadableStream | null;

    if (stream === null) return false;
    await stream.cancel("done");
    return true;
  }
  async status(key: string): Promise<CacheStatus> {
    return (await this.has(key)) ? CacheStatus.HIT : CacheStatus.MISS;
  }
  set(key: string, resultImg: Uint8Array): Promise<void> {
    return this.cache?.put(key, resultImg.buffer, {
      expirationTtl: this.config.ttl,
    });
  }
  clear(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
