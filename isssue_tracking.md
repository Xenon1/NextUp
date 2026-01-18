# Issue Tracking Guide

This document explains how issues are tracked, progressed, and closed in the NextUp project.  
It is intended for both users reporting issues and contributors working on the codebase.

---

## 📌 Issue Lifecycle

NextUp uses **status labels** to clearly indicate the current state of an issue.  
Each issue should have **exactly one status label** at any given time.

### 🆕 Status: 🆕 Triage
**New issue, not yet reviewed**

- Issue has been newly created
- May be missing details or reproduction steps
- Awaiting initial review by a maintainer

---

### 📌 Status: 📌 Accepted
**Reviewed and accepted**

- Issue has been confirmed as valid
- Fits the scope and goals of NextUp
- Ready to be picked up by a contributor

---

### 🚧 Status: 🚧 In Progress
**Actively being worked on**

- Issue is assigned to a contributor
- Development work has started
- Linked pull request may exist

---

### 🔍 Status: 🔍 Review
**Pull request under review**

- A pull request addressing the issue has been opened
- Awaiting review, feedback, or approval
- Changes may be requested before merge

---

### 🚀 Status: 🚀 Ready for build
**Completed and tested**

- Pull request has been approved and merged
- Fix or feature has been tested
- Ready to be included in the next official build or release

---

## 🧑‍💻 Issue Assignment

- Issues are assigned once work begins
- Assignment indicates **active ownership**, not just interest
- If an assignee becomes unavailable, the issue may be unassigned

### Claiming an Issue
Contributors may:
- Comment on an issue to express interest
- Wait for a maintainer to assign the issue
- Be assigned after confirming availability

Unassigned issues with `Status: 📌 Accepted` are considered open for contribution.

---

## 🔗 Linking Pull Requests

Pull requests should reference the related issue using the following keyword:

- Addresses #123

This ensures:
- Automatic linking between issues and PRs
- Clear traceability of changes

---

## 📦 Issue Closure & Releases

Issues are **not closed immediately when a pull request is merged**.

### When an issue is closed
An issue is closed when:
- The fix or feature is included in an **official NextUp release**
- The release has been published and is available to users

When closing an issue, maintainers should:
- Add a comment noting the release version, for example:
  > “Fixed in v1.4.0 🚀”

---

## 🚫 Closed Without Fix

Issues may be closed without a release if they are:
- Duplicates of an existing issue
- Out of scope for the project
- Not reproducible after investigation

In these cases, a brief explanation will always be provided.

---

## ℹ️ Additional Notes

- Status labels represent **progress**, not priority
- Priority is managed separately by maintainers
- If an issue has no status label, it has not yet been triaged

---

Thank you for helping improve NextUp! 🎉  
Clear issue tracking helps keep the project healthy and transparent for everyone.
