# Sources: Undoing things (fact-checked 2026-10-11)

- git-restore (working tree from the index; --staged from HEAD into the index), git-reset (--soft, --mixed default, --hard), git-commit --amend, git-revert. Pro Git §7.7 "Reset Demystified".
- Local check (git 2.48): after `reset --hard`, unstaged edits are lost; the HEAD move is recorded in the reflog (`HEAD@{1}`); staged content survives as a dangling blob recoverable with `git fsck --lost-found`.

Full notes: scratchpad `sd/git/m14-facts.md`. The mistakes are made up.
