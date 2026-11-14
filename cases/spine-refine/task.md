Refine this story. Triage verdict: Ready.

# Story: Reorder a previous order in one step

> **Slug:** reorder
> **Story ID:** S-1

## User story
As a returning customer, I want to reorder a previous order in one step, so
that I do not have to rebuild the same cart.

## Acceptance criteria

### AC-1: Reorder creates a new order
- **Given** a customer with a past order of 2 Mugs
- **When** they choose Reorder on that order
- **Then** a new order with 2 Mugs is created at today's prices

### AC-2: A product is no longer sold
- **Given** a past order containing a product that is no longer sold
- **When** the customer chooses Reorder
- **Then** no order is created and the customer is told which product is unavailable

### AC-3: Someone else's order
- **Given** an order that belongs to another customer
- **When** a customer tries to reorder it
- **Then** the request is denied and no order is created

## Non-goals
- **NG-1:** Editing quantities during reorder.
