declare namespace _default {
    let $schema: string;
    let $comment: string;
    let $ref: string;
    namespace definitions {
        namespace YahooFinanceOptions {
            let type: string;
            namespace properties {
                namespace YF_QUERY_HOST {
                    let type_1: string;
                    export { type_1 as type };
                }
                namespace queue {
                    let $ref_1: string;
                    export { $ref_1 as $ref };
                }
                namespace validation {
                    let $ref_2: string;
                    export { $ref_2 as $ref };
                }
                namespace suppressNotices {
                    let type_2: string;
                    export { type_2 as type };
                    export namespace items {
                        let $ref_3: string;
                        export { $ref_3 as $ref };
                    }
                }
                namespace quoteCombine {
                    let $ref_4: string;
                    export { $ref_4 as $ref };
                }
                namespace versionCheck {
                    let type_3: string;
                    export { type_3 as type };
                }
            }
            let additionalProperties: boolean;
        }
        namespace QueueOptions {
            let type_4: string;
            export { type_4 as type };
            export namespace properties_1 {
                namespace _queue {
                    let $ref_5: string;
                    export { $ref_5 as $ref };
                }
                namespace concurrency {
                    let type_5: string;
                    export { type_5 as type };
                }
            }
            export { properties_1 as properties };
            let additionalProperties_1: boolean;
            export { additionalProperties_1 as additionalProperties };
        }
        namespace Queue {
            let type_6: string;
            export { type_6 as type };
            export namespace properties_2 {
                export namespace concurrency_1 {
                    let type_7: string;
                    export { type_7 as type };
                }
                export { concurrency_1 as concurrency };
                export namespace _running {
                    let type_8: string;
                    export { type_8 as type };
                }
                export namespace _queue_1 {
                    let type_9: string;
                    export { type_9 as type };
                    export namespace items_1 {
                        let type_10: string;
                        export { type_10 as type };
                        export namespace properties_3 {
                            let func: {};
                            let resolve: {};
                            let reject: {};
                        }
                        export { properties_3 as properties };
                        export let required: string[];
                        let additionalProperties_2: boolean;
                        export { additionalProperties_2 as additionalProperties };
                    }
                    export { items_1 as items };
                }
                export { _queue_1 as _queue };
            }
            export { properties_2 as properties };
            let required_1: string[];
            export { required_1 as required };
            let additionalProperties_3: boolean;
            export { additionalProperties_3 as additionalProperties };
        }
        namespace ValidationOptions {
            let type_11: string;
            export { type_11 as type };
            export namespace properties_4 {
                namespace logErrors {
                    let type_12: string;
                    export { type_12 as type };
                }
                namespace logOptionsErrors {
                    let type_13: string;
                    export { type_13 as type };
                }
                namespace allowAdditionalProps {
                    let type_14: string;
                    export { type_14 as type };
                }
            }
            export { properties_4 as properties };
            let additionalProperties_4: boolean;
            export { additionalProperties_4 as additionalProperties };
        }
        namespace NOTICE_IDS {
            let type_15: string;
            export { type_15 as type };
            let _enum: string[];
            export { _enum as enum };
        }
        namespace QuoteCombineOptions {
            let type_16: string;
            export { type_16 as type };
            export namespace properties_5 {
                namespace maxSymbolsPerRequest {
                    let type_17: string;
                    export { type_17 as type };
                }
                namespace debounceTime {
                    let type_18: string;
                    export { type_18 as type };
                }
            }
            export { properties_5 as properties };
            let additionalProperties_5: boolean;
            export { additionalProperties_5 as additionalProperties };
        }
    }
}
export default _default;
//# sourceMappingURL=optionsJson.schema.d.ts.map