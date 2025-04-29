import { delay, type DefaultBodyType, type HttpResponseResolver, type PathParams } from "msw"

export default function withDelay<
    // Recreate the generic signature of the HTTP resolver
    // so the arguments passed to "http.get" propagate here.
    Params extends PathParams,
    RequestBodyType extends DefaultBodyType,
    ResponseBodyType extends DefaultBodyType,
>(durationMs: number, resolver: HttpResponseResolver<Params, RequestBodyType, ResponseBodyType>): HttpResponseResolver<Params, RequestBodyType, ResponseBodyType> {
    return async (...args) => {
        await delay(durationMs)
        return resolver(...args)
    }
}
