### 0001: Diagram Schema

## Status

Accepted

## Context

LLM must return a renderable graph.

## Decision

node/edge schemas with fixed enums for type and layer plus OTHER

Node: id , lable , type , layer , description

Edge: from , to , label , protocol , direction , communication

NodeType: CLIENT | CDN | LOAD_BALANCER | GATEWAY | PROXY | API_SERVER | WORKER | CACHE | DATABASE | STORAGE | QUEUE | EXTERNAL_SERVICE | OTHER

Layer: CLIENT | EDGE | APPLICATION | DATA | EXTERNAL

Direction: SYNC | ASYNC

## Alternatives

Free-text type : Rejected
Reason :
renderer can't map icons/colors to unpridictable strings;
models can produce three different spellings of one concept

## Consequences

New node type would require a code change and not just a prompt chnage
