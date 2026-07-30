# ADR 0001: Adopt an Incremental Modular Architecture

## Status

Accepted. The architectural direction is accepted; implementation will proceed incrementally through separate pull requests.

## Context

Focus Beat started as a small personal Pomodoro application. It now includes timer and preset rules, local persistence, YouTube music playback, task text, dated session history, bilingual content, configurable audio, and accessibility requirements. Some React modules consequently coordinate several responsibilities.

The possible Free Simple and Free Advanced experiences should share the same timer core. A possible paid application may one day require different infrastructure, but it does not exist and has no concrete technical requirements. Applying a premature enterprise-style architecture would add files, indirection, and maintenance cost without solving a current problem.

## Decision

The project will:

- remain a modular monolith;
- separate stable rules from React gradually;
- prefer pure functions for deterministic timer logic;
- isolate browser and external-service dependencies only where useful for testing, clarity, or replaceability;
- introduce interfaces only for justified replaceable boundaries;
- prefer composition over inheritance;
- remain local-first for the current free version;
- avoid permanent product-edition branches; and
- avoid designing paid infrastructure before it exists.

React contexts can remain orchestration and presentation-facing tools during the transition. Commercial editions will not be represented by timer subclasses, and local synchronous behavior will not be forced into speculative asynchronous contracts.

## Consequences

### Positive

- Timer rules become easier to test without React.
- Contexts can become smaller and focus on orchestration.
- Module responsibilities and dependency direction become clearer.
- Advanced UI/configuration features can be added with less risk of duplicating timer behavior.
- Future infrastructure can be replaced without rewriting stable timer rules.
- Shared code can be reused more easily if a paid application is eventually created.

### Negative

- The repository will contain more modules than the current implementation.
- Migration requires several small pull requests rather than a single restructuring.
- Some temporary duplication or adapters may exist during transition.
- Maintainers must continually resist unnecessary abstractions.

## Alternatives considered

### Keep all logic in React contexts

Rejected as the sole long-term structure because contexts are accumulating timer rules, persistence, browser effects, catalog data, and content responsibilities. Contexts remain useful orchestrators, but deterministic rules and replaceable technical details should not all stay embedded in them.

### Full Clean Architecture implementation

Rejected because a prescribed set of layers, entities, use-case classes, and interfaces would introduce excessive ceremony for the current project size. The selected direction borrows only useful dependency-boundary principles and does not mandate that pattern.

### Timer subclasses for Free, Advanced, and Pro

Rejected because product plans should not define core timer behavior. Simple and Advanced are experiences using the same engine; composition can add capabilities without `FreeTimer`, `AdvancedTimer`, or `ProTimer` classes.

### Permanent Free and Pro branches

Rejected because long-lived product branches create divergence, recurring merge conflicts, and duplicated fixes. Short-lived branches should integrate focused changes into a deployable main line.

### Immediate monorepo or package extraction

Rejected for now because there is no second application requiring a published or shared package. Internal modules are sufficient until a real reuse boundary appears.

## Follow-up decisions

Create further ADRs only when later work encounters a concrete decision that merits a durable record. Possible subjects are:

- timer-domain extraction;
- persistence contracts;
- music-provider architecture; and
- future shared-package extraction.

This ADR does not make those decisions or require those abstractions now.
