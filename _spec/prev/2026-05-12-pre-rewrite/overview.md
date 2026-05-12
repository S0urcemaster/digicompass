# Overview

## Product

Digi Compass is a web application for building personal mindset collections from short sayings paired with images.

Users browse a base library of sayings and images, add selected items to their own collection, combine collected sayings and collected images into foci, group collected foci into mindsets, and rate or annotate the result.

## Current Product Core

- The user always works on their personal collection, never directly on the whole base library when creating higher-level objects.
- A focus may only be created from a saying already present in `collection.sayings`.
- A focus may only be created from an image already present in `collection.images`.
- A mindset may only be created from foci already present in `collection.foci`.
- `collection.mindsets` contains only mindsets assembled from collected foci.

## Top-Level Views

Only one top-level view is active at a time:

- `navigator`
- `compass`
- `collection`

## Data Sources

- `frontend/src/data`: sayings, categories, and image references
- `frontend/public/images`: full-size image assets
- `frontend/public/images/preview`: preview image assets

## Project Structure

- `_spec/`: specification files
- `frontend/`: web frontend
