# BOND Build Notes

BOND is an Arc-native escrow product. Keep the interface calm, editorial, and honest.

## Design discipline

For web design and motion work, use the Emil Kowalski design engineering skills/taste pack from:

```text
https://github.com/emilkowalski/skills
```

Prefer restrained, high-signal UI over decorative filler. Remove AI/template copy. Motion should clarify state or feedback, not decorate repeated flows.

## Product facts to preserve

- Contract name: `BoundTestnet`.
- Live Arc Testnet contract: `0x1A3ea0d24ff15a90417508F38ABD8E173921082A`.
- No user-facing deal type or review-day choices.
- Buyer can release or dispute immediately after seller delivery.
- Seller can escalate only after fixed `RESPONSE_BUFFER = 12 hours` if buyer is silent.
- Market listing expiry is separate from escrow timing; active listings default to 30 days.
- Keep private keys, tokens, wallet secrets, and signatures out of logs and docs.
