# History Photo Restoration Design

## Goal

Restore the full `/istoriya` page and use the prepared, local photographs for the confirmed 1993–1998 chronology. Leave content and imagery before 1993 and after 2000 unchanged.

## Scope

- Restore the existing typed history page, which already renders `istoriya.ts` through `HistoryHero` and `Chapter` components.
- Add local image blocks for the 1993 and 1996 chapters, which currently have none.
- Replace only the figure sources and captions for chapters in the confirmed interval.
- Copy selected, already prepared images into `public/history/`; retain the candidate and archive folders unchanged.
- Preserve the current source state in Git before implementation.

## Confirmed chronology and image assignment

| Year | Model | Partner / market | Local image source | Site asset |
| --- | --- | --- | --- | --- |
| 1993 | RedBear MK120/60 | Gibson | Angelfire dark stack | `redbear-mk120-1993-dark-stack.jpg` |
| 1994 | RedBear MKE120/60 | Gibson | Angelfire front stack | `redbear-mke120-1994-front-stack.jpg` |
| 1995 | RedBear MKX CUB Combo | Gibson | selected MKX photo №10 | `redbear-mkx-cub-combo-1995-front.jpg` |
| 1995 | NOVIK N1202 / N602 | Pellarin | selected N1202 front image | `novik-n1202-n602-1995-front.jpg` |
| 1996 | NOVIK N1202C / N602C | Pellarin | selected rear-view photo №11 | `novik-n1202c-n602c-1996-rear.jpg` |
| 1997–1998 | MK50 Combo | domestic market | selected MK50 Combo front image | `novik-mk50-combo-1997-1998-front.jpg` |

The two Angelfire stack assets have been verified by SHA-256 against their renamed preparations. The original photo candidate folders remain the source-of-record and are not renamed or moved.

## Rendering

The existing `HistoryBlock` `figure` type is sufficient. Each new or replacement image is represented by a normal figure block immediately after the chapter text that identifies its model. No new UI component or data type is required.

## Verification

- Add an automated page-level test asserting that `/istoriya` renders the restored hero and all six planned image paths.
- Run the existing test suite and production build.
- Inspect the restored route locally to ensure all six images load and the unmodified pre-1993 and post-2000 assets remain referenced.
