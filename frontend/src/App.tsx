import { useEffect, useMemo, useState } from "react";
import categories from "./data/categories.json";
import imagesData from "./data/images.json";
import sayingsData from "./data/sayings.json";
import { createFactoryFoci } from "./data/factoryFoci";
import {
  clampRating,
  createMindset,
  createUserFocus,
  dedupeById,
  focusCategories,
  formatCategories,
  getContrastTone,
  imagePath,
  ratingSteps,
} from "./lib";
import type {
  AppState,
  CardVariant,
  CollectionView,
  EditorTab,
  Focus,
  ImageItem,
  Mindset,
  Saying,
  TopView,
} from "./types";

const STORAGE_KEY = "digicompass-state-v1";

const sayings = sayingsData as Saying[];
const images = imagesData as ImageItem[];
const factoryFoci = createFactoryFoci(sayings, images);

const defaultState: AppState = {
  topView: "mindset",
  collectionView: "images",
  editorTab: "foci",
  selectedSayingId: sayings[0]?.id ?? 0,
  selectedImageId: images[0]?.id ?? 0,
  selectedFactoryFocusId: factoryFoci[0]?.id ?? "",
  selectedStoreFocusId: null,
  selectedMindsetFocusIds: factoryFoci[0] ? [factoryFoci[0].id] : [],
  selectedMindsetId: null,
  focusedMindsetCardIndex: 0,
  fullscreenFocus: false,
  factorySayingRatings: {},
  factoryImageRatings: {},
  factoryFocusRatings: {},
  storeSayings: sayings[0] ? [sayings[0]] : [],
  storeImages: images[0] ? [images[0]] : [],
  storeFoci: factoryFoci[0] ? [factoryFoci[0]] : [],
  storeMindsets: factoryFoci[0] ? [createMindset([factoryFoci[0]])] : [],
  currentMindsetId: null,
};

if (!defaultState.currentMindsetId && defaultState.storeMindsets[0]) {
  defaultState.currentMindsetId = defaultState.storeMindsets[0].id;
  defaultState.selectedMindsetId = defaultState.storeMindsets[0].id;
}

const readState = (): AppState => {
  if (typeof window === "undefined") {
    return defaultState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultState;
  }

  try {
    return { ...defaultState, ...JSON.parse(raw) } as AppState;
  } catch {
    return defaultState;
  }
};

function App() {
  const [state, setState] = useState<AppState>(readState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const effectiveSayings = useMemo(
    () =>
      sayings.map((entry) => ({
        ...entry,
        rating: state.factorySayingRatings[entry.id] ?? entry.rating,
      })),
    [state.factorySayingRatings],
  );
  const effectiveImages = useMemo(
    () =>
      images.map((entry) => ({
        ...entry,
        rating: state.factoryImageRatings[entry.id] ?? entry.rating,
      })),
    [state.factoryImageRatings],
  );
  const effectiveFactoryFoci = useMemo(
    () =>
      factoryFoci.map((entry) => ({
        ...entry,
        rating: state.factoryFocusRatings[entry.id] ?? entry.rating,
      })),
    [state.factoryFocusRatings],
  );
  const selectedSaying =
    effectiveSayings.find((entry) => entry.id === state.selectedSayingId) ??
    effectiveSayings[0];
  const selectedImage =
    effectiveImages.find((entry) => entry.id === state.selectedImageId) ??
    effectiveImages[0];
  const selectedFactoryFocus =
    effectiveFactoryFoci.find((entry) => entry.id === state.selectedFactoryFocusId) ??
    effectiveFactoryFoci[0];
  const focusPreview =
    selectedSaying && selectedImage
      ? createUserFocus(selectedSaying, selectedImage)
      : null;
  const mindsetPreview = useMemo(() => {
    const chosen = state.storeFoci.filter((focus) =>
      state.selectedMindsetFocusIds.includes(focus.id),
    );
    return chosen.length ? createMindset(chosen) : null;
  }, [state.selectedMindsetFocusIds, state.storeFoci]);

  const currentMindset =
    state.storeMindsets.find(
      (mindset) => mindset.id === (state.currentMindsetId ?? state.selectedMindsetId),
    ) ?? state.storeMindsets[0] ?? null;
  const selectedMindset =
    state.storeMindsets.find((mindset) => mindset.id === state.selectedMindsetId) ??
    currentMindset;
  const focusedMindsetIndex = Math.min(
    state.focusedMindsetCardIndex,
    Math.max((currentMindset?.foci.length ?? 1) - 1, 0),
  );
  const focusedMindsetFocus =
    currentMindset?.foci[focusedMindsetIndex] ?? null;
  const mindsetPreviewFoci = currentMindset
    ? currentMindset.foci.filter((_, index) => index !== focusedMindsetIndex)
    : [];

  const updateState = (patch: Partial<AppState>) =>
    setState((current) => ({ ...current, ...patch }));

  const updateStoreItemRating = (
    kind: "sayings" | "images" | "foci" | "mindsets",
    id: string | number,
    value: number,
    keepActive = false,
  ) => {
    setState((current) => {
      const nextValue = clampRating(value);
      const resolvedValue = keepActive ? nextValue : nextValue;

      if (kind === "sayings") {
        return {
          ...current,
          storeSayings: current.storeSayings.map((entry) =>
            entry.id === id ? { ...entry, rating: resolvedValue } : entry,
          ),
        };
      }

      if (kind === "images") {
        return {
          ...current,
          storeImages: current.storeImages.map((entry) =>
            entry.id === id ? { ...entry, rating: resolvedValue } : entry,
          ),
        };
      }

      if (kind === "foci") {
        return {
          ...current,
          storeFoci: current.storeFoci.map((entry) =>
            entry.id === id ? { ...entry, rating: resolvedValue } : entry,
          ),
          storeMindsets: current.storeMindsets.map((mindset) => ({
            ...mindset,
            foci: mindset.foci.map((entry) =>
              entry.id === id ? { ...entry, rating: resolvedValue } : entry,
            ),
          })),
        };
      }

      return {
        ...current,
        storeMindsets: current.storeMindsets.map((entry) =>
          entry.id === id ? { ...entry, rating: resolvedValue } : entry,
        ),
      };
    });
  };

  const updateFactoryRating = (
    kind: "sayings" | "images" | "foci",
    id: string | number,
    value: number,
  ) => {
    setState((current) => {
      if (kind === "sayings") {
        return {
          ...current,
          factorySayingRatings: {
            ...current.factorySayingRatings,
            [id]: clampRating(value),
          },
        };
      }

      if (kind === "images") {
        return {
          ...current,
          factoryImageRatings: {
            ...current.factoryImageRatings,
            [id]: clampRating(value),
          },
        };
      }

      return {
        ...current,
        factoryFocusRatings: {
          ...current.factoryFocusRatings,
          [id]: clampRating(value),
        },
      };
    });
  };

  const toggleStoreSaying = () => {
    if (!selectedSaying) {
      return;
    }

    setState((current) => {
      const exists = current.storeSayings.some((entry) => entry.id === selectedSaying.id);
      return {
        ...current,
        storeSayings: exists
          ? current.storeSayings.filter((entry) => entry.id !== selectedSaying.id)
          : dedupeById([...current.storeSayings, selectedSaying]),
      };
    });
  };

  const toggleStoreImage = () => {
    if (!selectedImage) {
      return;
    }

    setState((current) => {
      const exists = current.storeImages.some((entry) => entry.id === selectedImage.id);
      return {
        ...current,
        storeImages: exists
          ? current.storeImages.filter((entry) => entry.id !== selectedImage.id)
          : dedupeById([...current.storeImages, selectedImage]),
      };
    });
  };

  const toggleStoreFactoryFocus = () => {
    if (!selectedFactoryFocus) {
      return;
    }

    setState((current) => {
      const exists = current.storeFoci.some((entry) => entry.id === selectedFactoryFocus.id);
      const nextStoreFoci = exists
        ? current.storeFoci.filter((entry) => entry.id !== selectedFactoryFocus.id)
        : dedupeById([...current.storeFoci, selectedFactoryFocus]);
      const nextMindsets = current.storeMindsets
        .map((mindset) => ({
          ...mindset,
          foci: mindset.foci.filter((focus) => focus.id !== selectedFactoryFocus.id),
        }))
        .filter((mindset) => mindset.foci.length > 0);

      return {
        ...current,
        storeFoci: nextStoreFoci,
        storeMindsets: nextMindsets,
        currentMindsetId:
          current.currentMindsetId && nextMindsets.some((entry) => entry.id === current.currentMindsetId)
            ? current.currentMindsetId
            : nextMindsets[0]?.id ?? null,
        selectedMindsetId:
          current.selectedMindsetId && nextMindsets.some((entry) => entry.id === current.selectedMindsetId)
            ? current.selectedMindsetId
            : nextMindsets[0]?.id ?? null,
      };
    });
  };

  const saveFocusToStore = () => {
    if (!focusPreview) {
      return;
    }

    setState((current) => {
      const duplicate = current.storeFoci.some(
        (entry) =>
          entry.saying.id === focusPreview.saying.id &&
          entry.imageUrl === focusPreview.imageUrl,
      );

      if (duplicate) {
        return current;
      }

      return {
        ...current,
        storeFoci: [...current.storeFoci, focusPreview],
        selectedStoreFocusId: focusPreview.id,
      };
    });
  };

  const removeStoreFocus = (focusId: string) => {
    setState((current) => {
      const nextFoci = current.storeFoci.filter((entry) => entry.id !== focusId);
      const nextMindsets = current.storeMindsets
        .map((mindset) => ({
          ...mindset,
          foci: mindset.foci.filter((entry) => entry.id !== focusId),
        }))
        .filter((mindset) => mindset.foci.length > 0);

      return {
        ...current,
        storeFoci: nextFoci,
        storeMindsets: nextMindsets,
        selectedStoreFocusId:
          current.selectedStoreFocusId === focusId ? nextFoci[0]?.id ?? null : current.selectedStoreFocusId,
        currentMindsetId:
          current.currentMindsetId && nextMindsets.some((entry) => entry.id === current.currentMindsetId)
            ? current.currentMindsetId
            : nextMindsets[0]?.id ?? null,
        selectedMindsetId:
          current.selectedMindsetId && nextMindsets.some((entry) => entry.id === current.selectedMindsetId)
            ? current.selectedMindsetId
            : nextMindsets[0]?.id ?? null,
      };
    });
  };

  const saveMindsetToStore = () => {
    const chosen = state.storeFoci.filter((focus) =>
      state.selectedMindsetFocusIds.includes(focus.id),
    );
    if (!chosen.length) {
      return;
    }

    const nextMindset = createMindset(chosen);
    setState((current) => ({
      ...current,
      storeMindsets: [...current.storeMindsets, nextMindset],
      selectedMindsetId: nextMindset.id,
      currentMindsetId: nextMindset.id,
      topView: "mindset",
    }));
  };

  const toggleFocusInsideMindset = (focus: Focus) =>
    setState((current) => {
      const exists = current.selectedMindsetFocusIds.includes(focus.id);
      const nextIds = exists
        ? current.selectedMindsetFocusIds.filter((entry) => entry !== focus.id)
        : current.selectedMindsetFocusIds.length >= 5
          ? current.selectedMindsetFocusIds
          : [...current.selectedMindsetFocusIds, focus.id];

      return {
        ...current,
        selectedMindsetFocusIds: nextIds,
      };
    });

  const topTabs: Array<{ id: TopView; label: string }> = [
    { id: "navigator", label: "Navigator" },
    { id: "mindset", label: "Mindset" },
    { id: "collection", label: "Collection" },
  ];
  const collectionTabs: Array<{ id: CollectionView; label: string }> = [
    { id: "images", label: "Images" },
    { id: "sayings", label: "Sayings" },
    { id: "foci", label: "Foci" },
    { id: "editor", label: "Editor" },
  ];
  const editorTabs: Array<{ id: EditorTab; label: string }> = [
    { id: "foci", label: "Foci" },
    { id: "mindsets", label: "Mindsets" },
  ];

  return (
    <div className="page">
      <div className="app-shell">
        <header className="app-header">
          <div>
            <p className="eyebrow">Digi Compass</p>
            <h1>Persoenliche Orientierung aus Elementen und Foci</h1>
          </div>
          <p className="app-copy">
            Kategorien im Bestand: {categories.length}. Aktives Mindset:{" "}
            {currentMindset ? currentMindset.foci.length : 0} von 5 Foci.
          </p>
        </header>

        <nav className="top-tabs">
          {topTabs.map((tab) => (
            <button
              key={tab.id}
              className={tab.id === state.topView ? "chip is-active" : "chip"}
              onClick={() => updateState({ topView: tab.id })}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="app-body">
          {state.topView === "navigator" ? (
            <section className="panel placeholder">
              <p className="eyebrow">Navigator</p>
              <h2>Noch nicht fachlich ausdefiniert</h2>
              <p>
                Diese View ist als gleichberechtigte Hauptebene vorhanden. Sie
                bleibt absichtlich leicht, bis die Spec ihre Navigationsfunktion
                genauer beschreibt.
              </p>
              <button
                className="primary-button"
                onClick={() => updateState({ topView: "mindset" })}
                type="button"
              >
                Zum aktuellen Mindset wechseln
              </button>
            </section>
          ) : null}

          {state.topView === "mindset" ? (
            <section className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Mindset View</p>
                  <h2>Zuletzt gesetztes Mindset</h2>
                </div>
                <div className="button-row">
                  {selectedMindset ? (
                    <button
                      className="secondary-button"
                      onClick={() =>
                        updateState({
                          currentMindsetId: selectedMindset.id,
                          topView: "mindset",
                        })
                      }
                      type="button"
                    >
                      Als Hauptansicht setzen
                    </button>
                  ) : null}
                  {focusedMindsetFocus ? (
                    <button
                      className="secondary-button"
                      onClick={() =>
                        updateState({
                          fullscreenFocus: !state.fullscreenFocus,
                        })
                      }
                      type="button"
                    >
                      {state.fullscreenFocus ? "Vollbild verlassen" : "Focus voll zeigen"}
                    </button>
                  ) : null}
                </div>
              </div>

              {!currentMindset ? (
                <EmptyState
                  title="Noch kein Mindset im Store"
                  text="Nimm Factory-Foci in die Collection auf oder baue im Editor ein erstes Mindset."
                />
              ) : (
                <div className={state.fullscreenFocus ? "mindset-grid is-fullscreen" : "mindset-grid"}>
                  <div className="mindset-main">
                    {focusedMindsetFocus ? (
                      <FocusCard
                        focus={focusedMindsetFocus}
                        variant="selected"
                        active
                        ratingLocked
                        onRate={(value) =>
                          updateStoreItemRating(
                            "foci",
                            focusedMindsetFocus.id,
                            value,
                            true,
                          )
                        }
                      />
                    ) : null}
                  </div>
                  {!state.fullscreenFocus ? (
                    <div className="mindset-side">
                      {Array.from({ length: 4 }, (_, index) => {
                        const focus = mindsetPreviewFoci[index];

                        if (!focus) {
                          return <EmptySlot key={`empty-${index}`} label="Leerer Platz" />;
                        }

                        return (
                          <button
                            key={focus.id}
                            className="slot-button"
                            onClick={() =>
                              updateState({
                                focusedMindsetCardIndex: currentMindset.foci.findIndex(
                                  (entry) => entry.id === focus.id,
                                ),
                              })
                            }
                            type="button"
                          >
                            <FocusCard focus={focus} variant="preview" />
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              )}
            </section>
          ) : null}

          {state.topView === "collection" ? (
            <section className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Collection</p>
                  <h2>Sammlung, Auswahl und Verbindung</h2>
                </div>
                <p className="app-copy">
                  Store: {state.storeSayings.length} Sayings, {state.storeImages.length} Images,{" "}
                  {state.storeFoci.length} Foci, {state.storeMindsets.length} Mindsets.
                </p>
              </div>

              <nav className="sub-tabs">
                {collectionTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={tab.id === state.collectionView ? "chip is-active" : "chip"}
                    onClick={() => updateState({ collectionView: tab.id })}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              {state.collectionView === "images" ? (
                <BrowserSection
                  title="Factory Images"
                  description="Ein Bild auswaehlen, bewerten und in den persoenlichen Store uebernehmen."
                  actionLabel={
                    state.storeImages.some((entry) => entry.id === selectedImage?.id)
                      ? "Aus Store entfernen"
                      : "In Store aufnehmen"
                  }
                  onAction={toggleStoreImage}
                >
                  <CardBrowser<ImageItem>
                    items={effectiveImages}
                    selectedId={selectedImage?.id}
                    onSelect={(item) => updateState({ selectedImageId: item.id })}
                    renderCard={(item, variant, active) => (
                      <ImageCard
                        image={item}
                        variant={variant}
                        active={active}
                        onRate={
                          variant === "selected"
                            ? (value) =>
                                updateFactoryRating("images", item.id, value)
                            : undefined
                        }
                      />
                    )}
                  />
                </BrowserSection>
              ) : null}

              {state.collectionView === "sayings" ? (
                <BrowserSection
                  title="Factory Sayings"
                  description="Ein Saying auswaehlen, bewerten und in den persoenlichen Store uebernehmen."
                  actionLabel={
                    state.storeSayings.some((entry) => entry.id === selectedSaying?.id)
                      ? "Aus Store entfernen"
                      : "In Store aufnehmen"
                  }
                  onAction={toggleStoreSaying}
                >
                  <CardBrowser<Saying>
                    items={effectiveSayings}
                    selectedId={selectedSaying?.id}
                    onSelect={(item) => updateState({ selectedSayingId: item.id })}
                    renderCard={(item, variant, active) => (
                      <SayingCard
                        saying={item}
                        variant={variant}
                        active={active}
                        onRate={
                          variant === "selected"
                            ? (value) =>
                                updateFactoryRating("sayings", item.id, value)
                            : undefined
                        }
                      />
                    )}
                  />
                </BrowserSection>
              ) : null}

              {state.collectionView === "foci" ? (
                <BrowserSection
                  title="Factory Foci"
                  description="Vorkomponierte Foci fuer schnellen Einstieg in den persoenlichen Store."
                  actionLabel={
                    state.storeFoci.some((entry) => entry.id === selectedFactoryFocus?.id)
                      ? "Aus Store entfernen"
                      : "In Store aufnehmen"
                  }
                  onAction={toggleStoreFactoryFocus}
                >
                  <CardBrowser<Focus>
                    items={effectiveFactoryFoci}
                    selectedId={selectedFactoryFocus?.id}
                    onSelect={(item) => updateState({ selectedFactoryFocusId: item.id })}
                    renderCard={(item, variant, active) => (
                      <FocusCard
                        focus={item}
                        variant={variant}
                        active={active}
                        onRate={
                          variant === "selected"
                            ? (value) => updateFactoryRating("foci", item.id, value)
                            : undefined
                        }
                      />
                    )}
                  />
                </BrowserSection>
              ) : null}

              {state.collectionView === "editor" ? (
                <div className="editor-layout">
                  <nav className="sub-tabs">
                    {editorTabs.map((tab) => (
                      <button
                        key={tab.id}
                        className={tab.id === state.editorTab ? "chip is-active" : "chip"}
                        onClick={() => updateState({ editorTab: tab.id })}
                        type="button"
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>

                  {state.editorTab === "foci" ? (
                    <section className="editor-panel">
                      <div className="editor-copy">
                        <h3>Focus bilden</h3>
                        <p>
                          Ein Saying und ein Image aus dem Store ergeben die aktuelle
                          Vorschau. Beim Speichern wird daraus ein neuer Focus im Store.
                        </p>
                      </div>
                      <div className="editor-grid">
                        <div>
                          <h4>Store Sayings</h4>
                          <SelectableList
                            items={state.storeSayings}
                            selectedId={selectedSaying?.id}
                            getLabel={(item) => item.text}
                            getMeta={(item) => item.categories.join(" · ")}
                            onSelect={(item) => updateState({ selectedSayingId: item.id })}
                          />
                        </div>
                        <div>
                          <h4>Store Images</h4>
                          <SelectableList
                            items={state.storeImages}
                            selectedId={selectedImage?.id}
                            getLabel={(item) => item.url}
                            getMeta={(item) => item.category}
                            onSelect={(item) => updateState({ selectedImageId: item.id })}
                          />
                        </div>
                        <div>
                          <h4>Focus Vorschau</h4>
                          {focusPreview ? (
                            <FocusCard focus={focusPreview} variant="selected" active />
                          ) : (
                            <EmptyState
                              title="Keine Vorschau"
                              text="Nimm zuerst Saying und Image in den Store auf."
                            />
                          )}
                        </div>
                      </div>
                      <div className="button-row">
                        <button className="primary-button" onClick={saveFocusToStore} type="button">
                          Focus speichern
                        </button>
                      </div>
                      <div>
                        <h4>Gespeicherte Foci</h4>
                        <SelectableList
                          items={state.storeFoci}
                          selectedId={state.selectedStoreFocusId}
                          getLabel={(item) => item.saying.text}
                          getMeta={(item) => focusCategories(item).join(" · ")}
                          onSelect={(item) => updateState({ selectedStoreFocusId: item.id })}
                          renderAction={(item) => (
                            <button
                              className="ghost-button"
                              onClick={(event) => {
                                event.stopPropagation();
                                removeStoreFocus(item.id);
                              }}
                              type="button"
                            >
                              Entfernen
                            </button>
                          )}
                        />
                      </div>
                    </section>
                  ) : null}

                  {state.editorTab === "mindsets" ? (
                    <section className="editor-panel">
                      <div className="editor-copy">
                        <h3>Mindset bilden</h3>
                        <p>
                          Ein Mindset traegt mindestens einen und hoechstens fuenf
                          gespeicherte Foci. Die Vorschau wird danach als aktuelle
                          Hauptansicht setzbar.
                        </p>
                      </div>
                      <div className="editor-grid mindset-editor-grid">
                        <div>
                          <h4>Store Foci</h4>
                          <div className="mini-card-list">
                            {state.storeFoci.map((focus) => {
                              const isSelected = state.selectedMindsetFocusIds.includes(focus.id);
                              return (
                                <button
                                  key={focus.id}
                                  className={isSelected ? "mini-card is-selected" : "mini-card"}
                                  onClick={() => toggleFocusInsideMindset(focus)}
                                  type="button"
                                >
                                  <span>{focus.saying.text}</span>
                                  <small>{focusCategories(focus).join(" · ")}</small>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                        <h4>Mindset Auswahl</h4>
                        {mindsetPreview ? (
                          <FocusCard
                            focus={mindsetPreview.foci[0]}
                            variant="selected"
                            active
                          />
                        ) : (
                          <EmptyState
                            title="Keine Mindset-Vorschau"
                            text="Waehle mindestens einen Focus aus dem Store."
                          />
                        )}
                      </div>
                      <div>
                        <h4>Gespeicherte Mindsets</h4>
                        <SelectableList
                          items={state.storeMindsets}
                          selectedId={state.selectedMindsetId}
                            getLabel={(item) => `Mindset mit ${item.foci.length} Focus/Foci`}
                            getMeta={(item) => `${item.rating.toFixed(1)} Relevanz`}
                            onSelect={(item) =>
                              updateState({
                                selectedMindsetId: item.id,
                                currentMindsetId: item.id,
                                focusedMindsetCardIndex: 0,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="button-row">
                        <button className="primary-button" onClick={saveMindsetToStore} type="button">
                          Auswahl als neues Mindset speichern
                        </button>
                      </div>
                    </section>
                  ) : null}
                </div>
              ) : null}
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}

type BrowserSectionProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  children: React.ReactNode;
};

function BrowserSection({
  title,
  description,
  actionLabel,
  onAction,
  children,
}: BrowserSectionProps) {
  return (
    <div className="browser-section">
      <div className="panel-head">
        <div>
          <h3>{title}</h3>
          <p className="app-copy">{description}</p>
        </div>
        <button className="primary-button" onClick={onAction} type="button">
          {actionLabel}
        </button>
      </div>
      {children}
    </div>
  );
}

type CardBrowserProps<T extends { id: string | number }> = {
  items: T[];
  selectedId?: string | number;
  onSelect: (item: T) => void;
  renderCard: (item: T, variant: CardVariant, active: boolean) => React.ReactNode;
};

function CardBrowser<T extends { id: string | number }>({
  items,
  selectedId,
  onSelect,
  renderCard,
}: CardBrowserProps<T>) {
  const selectedIndex = Math.max(
    items.findIndex((item) => item.id === selectedId),
    0,
  );
  const selected = items[selectedIndex];
  const previews = items
    .filter((item) => item.id !== selected?.id)
    .slice(0, 8);

  return (
    <div className="browser-grid">
      {selected ? (
        <button className="browser-selected" onClick={() => onSelect(selected)} type="button">
          {renderCard(selected, "selected", true)}
        </button>
      ) : (
        <EmptySlot label="Keine Auswahl" />
      )}
      {previews.map((item) => (
        <button key={item.id} className="browser-preview" onClick={() => onSelect(item)} type="button">
          {renderCard(item, "preview", false)}
        </button>
      ))}
      {Array.from({ length: Math.max(0, 8 - previews.length) }, (_, index) => (
        <EmptySlot key={`slot-${index}`} label="Leerer Platz" />
      ))}
    </div>
  );
}

type RatingBarProps = {
  rating: number;
  tone: "light" | "dark";
  interactive?: boolean;
  keepActive?: boolean;
  onRate?: (value: number) => void;
};

function RatingBar({
  rating,
  tone,
  interactive = false,
  keepActive = false,
  onRate,
}: RatingBarProps) {
  return (
    <div className={`rating-bar is-${tone}`}>
      {ratingSteps.map((step) => {
        const active = rating >= step;
        return (
          <button
            key={step}
            className={active ? "rating-dot is-active" : "rating-dot"}
            disabled={!interactive}
            onClick={() => {
              if (!onRate) {
                return;
              }

              if (!keepActive && rating === step) {
                onRate(0);
                return;
              }

              onRate(step);
            }}
            type="button"
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

type CardFrameProps = {
  variant: CardVariant;
  imageUrl?: string;
  imageColor?: ImageItem["color"];
  categories: string[];
  text: string;
  rating: number;
  active?: boolean;
  ratingLocked?: boolean;
  onRate?: (value: number) => void;
};

function CardFrame({
  variant,
  imageUrl,
  imageColor,
  categories,
  text,
  rating,
  active = false,
  ratingLocked = false,
  onRate,
}: CardFrameProps) {
  const tone = getContrastTone(imageColor);
  const classes = [
    "card",
    `is-${variant}`,
    imageUrl ? "has-image" : "is-text-only",
    tone === "light" ? "tone-light" : "tone-dark",
    active ? "is-active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const textStyle =
    variant === "selected"
      ? { fontSize: "clamp(1rem, 2.8vw, 2rem)" }
      : { fontSize: "clamp(0.75rem, 1.6vw, 1rem)" };

  return (
    <article className={classes}>
      {imageUrl ? (
        <img alt="" className="card-image" src={imagePath(imageUrl)} />
      ) : null}
      <div className="card-overlay">
        <header className="card-header">
          {formatCategories(categories).map((category) => (
            <span key={category} className="category-pill">
              {category}
            </span>
          ))}
        </header>
        <div className="card-content">
          <p style={textStyle}>{text}</p>
        </div>
        <footer className="card-footer">
          <RatingBar
            rating={rating}
            tone={tone}
            interactive={Boolean(onRate)}
            keepActive={ratingLocked}
            onRate={onRate}
          />
        </footer>
      </div>
    </article>
  );
}

function FocusCard({
  focus,
  variant,
  active = false,
  ratingLocked = false,
  onRate,
}: {
  focus: Focus;
  variant: CardVariant;
  active?: boolean;
  ratingLocked?: boolean;
  onRate?: (value: number) => void;
}) {
  return (
    <CardFrame
      variant={variant}
      imageUrl={focus.imageUrl}
      imageColor={focus.imageColor}
      categories={focusCategories(focus)}
      text={focus.saying.text}
      rating={focus.rating}
      active={active}
      ratingLocked={ratingLocked}
      onRate={onRate}
    />
  );
}

function ImageCard({
  image,
  variant,
  active = false,
  onRate,
}: {
  image: ImageItem;
  variant: CardVariant;
  active?: boolean;
  onRate?: (value: number) => void;
}) {
  return (
    <CardFrame
      variant={variant}
      imageUrl={image.url}
      imageColor={image.color}
      categories={[image.category]}
      text=""
      rating={image.rating}
      active={active}
      onRate={onRate}
    />
  );
}

function SayingCard({
  saying,
  variant,
  active = false,
  onRate,
}: {
  saying: Saying;
  variant: CardVariant;
  active?: boolean;
  onRate?: (value: number) => void;
}) {
  return (
    <CardFrame
      variant={variant}
      categories={saying.categories}
      text={saying.text}
      rating={saying.rating}
      active={active}
      onRate={onRate}
    />
  );
}

function EmptySlot({ label }: { label: string }) {
  return <div className="empty-slot">{label}</div>;
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

type SelectableListProps<T extends { id: string | number }> = {
  items: T[];
  selectedId: string | number | null | undefined;
  getLabel: (item: T) => string;
  getMeta: (item: T) => string;
  onSelect: (item: T) => void;
  renderAction?: (item: T) => React.ReactNode;
};

function SelectableList<T extends { id: string | number }>({
  items,
  selectedId,
  getLabel,
  getMeta,
  onSelect,
  renderAction,
}: SelectableListProps<T>) {
  if (!items.length) {
    return <EmptyState title="Noch leer" text="Hier ist aktuell kein Eintrag vorhanden." />;
  }

  return (
    <div className="list-stack">
      {items.map((item) => (
        <button
          key={item.id}
          className={item.id === selectedId ? "list-item is-selected" : "list-item"}
          onClick={() => onSelect(item)}
          type="button"
        >
          <span>{getLabel(item)}</span>
          <small>{getMeta(item)}</small>
          {renderAction ? <span className="list-action">{renderAction(item)}</span> : null}
        </button>
      ))}
    </div>
  );
}

export default App;
