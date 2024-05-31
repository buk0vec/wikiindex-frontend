import * as v from "valibot";

export const MistralQuery = v.object({
  source: v.literal("server"),
  dest: v.literal("mistral"),
  query: v.string(),
});

export const MistralResponse = v.object({
  source: v.literal("mistral"),
  dest: v.literal("server"),
  message: v.string(),
});

export const ClientResponse = v.object({
  source: v.string("server"),
  to: v.string("client"),
  message: v.string(),
});

export const ColBERTRequest = v.object({
  source: v.literal("server"),
  dest: v.literal("colbert"),
  query: v.string(),
});

export const ColBERTResponse = v.object({
  source: v.literal("colbert"),
  dest: v.literal("server"),
  message: v.array(
    v.object({
      pid: v.number(),
      prob: v.number(),
      rank: v.number(),
      score: v.number(),
      text: v.string(),
    })
  ),
});

export const v_SSE = v.variant("type", [
  v.object({
    type: v.literal("mistral-query"),
    data: MistralQuery,
  }),
  v.object({
    type: v.literal("mistral-response"),
    data: MistralResponse,
  }),
  v.object({
    type: v.literal("client-response"),
    data: ClientResponse,
  }),
  v.object({
    type: v.literal("colbert-request"),
    data: ColBERTRequest,
  }),
  v.object({
    type: v.literal("colbert-response"),
    data: ColBERTResponse,
  }),
]);

export type SSE = v.InferInput<typeof v_SSE>;

export const parseEvent = (data: unknown): SSE => {
  if (v.is(MistralQuery, data)) {
    return v.parse(v_SSE, {
      type: "mistral-query",
      data: v.parse(MistralQuery, data),
    });
  }
  if (v.is(MistralResponse, data)) {
    return v.parse(v_SSE, {
      type: "mistral-response",
      data: v.parse(MistralResponse, data),
    });
  }
  if (v.is(ClientResponse, data)) {
    return v.parse(v_SSE, {
      type: "client-response",
      data: v.parse(ClientResponse, data),
    });
  }
  console.log(v.safeParse(ColBERTRequest, data))
  if (v.is(ColBERTRequest, data)) {
    return v.parse(v_SSE, {
      type: "colbert-request",
      data: v.parse(ColBERTRequest, data),
    });
  }
  if (v.is(ColBERTResponse, data)) {
    return v.parse(v_SSE, {
      type: "colbert-response",
      data: v.parse(ColBERTResponse, data),
    });
  }
  console.error("Invalid event")
  console.error(data)
  throw new Error("Invalid event: " + JSON.stringify(data));
};
