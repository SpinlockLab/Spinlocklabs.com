---
title: "Local LLMs for security research on radiance"
status: "Active"
summary:
  "Running local large language models for security tasks on a pair of Radeon AI PRO R9700 GPUs with the radiance inference engine."
updated: 2026-11-10
tags: ["llm", "local-inference", "amd-gpu", "radiance"]
externalLinks:
  - label: "radiance"
    href: "https://codeberg.org/StillDeadcode/radiance"
---

## Question

Can local large language models do security work without sending data to a
third-party API? We run models on our own hardware and study what they get
right, where they fail, and what that means for a threat model that assumes
"the model is on-prem, so it is safe."

## Setup

- **Engine:** [radiance](https://codeberg.org/StillDeadcode/radiance), an
  inference server for AMD GPUs written in C++ and HIP. It exposes OpenAI-
  compatible chat and completions APIs, which lets us use standard tooling
  against local models.
- **Hardware:** two Radeon AI PRO R9700 (RDNA4) GPUs, tensor-parallel.
- **Models:** 27B-class local models in FP8 and quantized formats. The
  quantized variants fit one card and let us compare quality against
  throughput on the same hardware.

## What we are doing

1. **Capability probes.** Fixed security tasks: spotting vulnerable code,
   classifying suspicious configuration, summarizing incident logs. Each probe
   has a scoring rubric so results are comparable across model versions.
2. **Failure modes.** We catalogue how models fail: hallucinated CVEs,
   confident wrong patches, refusal patterns, and data that should never have
   been in the context.
3. **Quantization trade-offs.** The same model at FP8 and at 4-bit on the same
   two cards. Where does quality drop first on security tasks?

## Status

The harness is being built. No published results yet. When a probe set is
stable we will report the first numbers here and write up the method in the
blog.
