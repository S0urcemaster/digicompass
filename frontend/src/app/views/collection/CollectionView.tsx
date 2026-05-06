import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../../components/Button';
import { Tabs } from '../../../components/Tabs';
import { IMAGES } from '../../../data/images';
import { SAYINGS } from '../../../data/sayings';
import { preloadImages } from '../../../lib/imageCache';
import type { CompassImage, Focus, Mindset, Saying } from '../../../types/domain';
import { CollectionImagePanel } from './CollectionImagePanel';
import { CollectionSayingList } from './CollectionSayingList';
import { FocusTile } from '../shared/FocusTile';
import { ImageTile } from '../shared/ImageTile';
import { MindsetTile } from '../shared/MindsetTile';
import { SelectableTileGrid } from '../shared/SelectableTileGrid';
import { StarRating } from '../shared/StarRating';
import {
  getImageIdBadgeClassName,
  getImageOverlayTone,
} from './imageOverlayTone';

const COLLECTION_TABS = [
  { label: 'Bilder', value: 'images' },
  { label: 'Sprüche', value: 'sayings' },
  { label: 'Fokusse', value: 'foci' },
  { label: 'Mindsets', value: 'mindsets' },
] as const satisfies ReadonlyArray<{ disabled?: boolean; label: string; value: string }>;

const COLLECTION_IMAGE_PAGE_SIZE = 8;
const COLLECTION_FOCUS_PAGE_SIZE = 8;
const COLLECTION_MINDSET_PAGE_SIZE = 5;
const COLLECTION_SAYING_PAGE_SIZE = 7;
const FOCUS_EDITOR_IMAGE_PAGE_SIZE = 8;
const FOCUS_EDITOR_SAYING_PAGE_SIZE = 6;

const getPreviewImageUrl = (url: string) => url.replace('/images/', '/images/preview/');
const getFocusKey = (focus: Focus) => `${focus.saying.id}:${focus.image.id}`;

type CollectionTabValue = (typeof COLLECTION_TABS)[number]['value'];
type FocusPreviewSource = 'editor' | 'focus';
type MindsetListMode = 'mindsets' | 'foci';
type FocusListMode = 'foci' | 'images' | 'sayings';

type CollectionViewProps = {
  addMindset: (mindset: Mindset) => void;
  addCollectionFocus: (focus: Focus) => void;
  collectionFoci: Focus[];
  collectionImages: CompassImage[];
  collectionMindsets: Mindset[];
  collectionSayings: Saying[];
  addCollectionImage: (image: CompassImage) => void;
  addCollectionSaying: (saying: Saying) => void;
  removeCollectionFocus: (focusKey: string) => void;
  removeMindset: (index: number) => void;
  setCollectionFocusRating: (focusKey: string, rating: number) => void;
  setCollectionImageRating: (imageId: number, rating: number) => void;
  setMindsetRating: (index: number, rating: number) => void;
  setCollectionSayingRating: (sayingId: number, rating: number) => void;
  updateMindset: (index: number, patch: Partial<Mindset>) => void;
};

export function CollectionView({
  addMindset,
  addCollectionFocus,
  collectionFoci,
  collectionImages,
  collectionMindsets,
  collectionSayings,
  addCollectionImage,
  addCollectionSaying,
  removeCollectionFocus,
  removeMindset,
  setCollectionFocusRating,
  setCollectionImageRating,
  setMindsetRating,
  setCollectionSayingRating,
  updateMindset,
}: CollectionViewProps) {
  const emptyDraftSlots = () => Array.from({ length: 5 }, () => null as Focus | null);
  const shouldSyncFocusPageRef = useRef(false);
  const [activeTab, setActiveTab] = useState<CollectionTabValue>('foci');
  const [collectionFocusPage, setCollectionFocusPage] = useState(0);
  const [focusListMode, setFocusListMode] = useState<FocusListMode>('foci');
  const [focusPreviewSource, setFocusPreviewSource] = useState<FocusPreviewSource>('focus');
  const [focusEditorImagePage, setFocusEditorImagePage] = useState(0);
  const [focusEditorSayingPage, setFocusEditorSayingPage] = useState(0);
  const [selectedCollectionImageCategoryIndex, setSelectedCollectionImageCategoryIndex] = useState(0);
  const [isCollectionImageCategoryFilterActive, setIsCollectionImageCategoryFilterActive] = useState(false);
  const [selectedCollectionFocusCategoryIndex, setSelectedCollectionFocusCategoryIndex] = useState(0);
  const [isCollectionFocusCategoryFilterActive, setIsCollectionFocusCategoryFilterActive] = useState(false);
  const [collectionImagePage, setCollectionImagePage] = useState(0);
  const [lastVisibleCollectionImages, setLastVisibleCollectionImages] = useState<CompassImage[]>(IMAGES);
  const [selectedCollectionFocusKey, setSelectedCollectionFocusKey] = useState<string | null>(null);
  const [selectedFocusEditorImageId, setSelectedFocusEditorImageId] = useState<number | null>(null);
  const [selectedCollectionImageId, setSelectedCollectionImageId] = useState<number | null>(IMAGES[0]?.id ?? null);
  const [selectedCollectionMindsetIndex, setSelectedCollectionMindsetIndex] = useState(0);
  const [collectionMindsetPage, setCollectionMindsetPage] = useState(0);
  const [collectionModeFocusPage, setCollectionModeFocusPage] = useState(0);
  const [mindsetListMode, setMindsetListMode] = useState<MindsetListMode>('mindsets');
  const [isEditingMindsetDraft, setIsEditingMindsetDraft] = useState(false);
  const [editingMindsetIndex, setEditingMindsetIndex] = useState<number | null>(null);
  const [draftMindsetName, setDraftMindsetName] = useState('Neues Mindset');
  const [draftMindsetRating, setDraftMindsetRating] = useState(0);
  const [draftMindsetFoci, setDraftMindsetFoci] = useState<Array<Focus | null>>(emptyDraftSlots);
  const [selectedDraftMindsetSlot, setSelectedDraftMindsetSlot] = useState(0);
  const [zoomedImageId, setZoomedImageId] = useState<number | null>(null);
  const [showCollectionImageIds, setShowCollectionImageIds] = useState(false);
  const [collectionSayingFilter, setCollectionSayingFilter] = useState('');
  const [collectionSayingPage, setCollectionSayingPage] = useState(0);
  const [selectedFocusEditorSayingId, setSelectedFocusEditorSayingId] = useState<number | null>(null);
  const [selectedCollectionSayingId, setSelectedCollectionSayingId] = useState<number | null>(SAYINGS[0]?.id ?? null);
  const [showCollectionSayingIds, setShowCollectionSayingIds] = useState(true);

  const normalizedSayingFilter = collectionSayingFilter.trim().toLowerCase();
  const availableImageCategories = useMemo(
    () =>
      Array.from(
        new Set(
          IMAGES.flatMap((image) => image.categories.map((category) => category.text.trim())).filter(Boolean)
        )
      ).sort((left, right) => left.localeCompare(right, 'de')),
    []
  );
  const selectedCollectionImageCategory =
    availableImageCategories[
      Math.min(selectedCollectionImageCategoryIndex, Math.max(availableImageCategories.length - 1, 0))
    ] ?? '';
  const availableFocusCategories = useMemo(
    () =>
      Array.from(
        new Set(
          [
            ...collectionFoci.flatMap((focus) => [
              ...focus.image.categories.map((category) => category.text.trim()),
              ...focus.saying.categories.map((category) => category.text.trim()),
            ]),
            ...collectionImages.flatMap((image) => image.categories.map((category) => category.text.trim())),
            ...collectionSayings.flatMap((saying) => saying.categories.map((category) => category.text.trim())),
          ].filter(Boolean)
        )
      ).sort((left, right) => left.localeCompare(right, 'de')),
    [collectionFoci, collectionImages, collectionSayings]
  );
  const selectedCollectionFocusCategory =
    availableFocusCategories[
      Math.min(selectedCollectionFocusCategoryIndex, Math.max(availableFocusCategories.length - 1, 0))
    ] ?? '';
  const normalizedFocusFilter =
    isCollectionFocusCategoryFilterActive && selectedCollectionFocusCategory
      ? selectedCollectionFocusCategory.trim().toLowerCase()
      : '';

  const filteredCollectionFoci = collectionFoci.filter((focus) =>
    normalizedFocusFilter.length === 0
      ? true
      : focus.image.categories.some((category) => category.text.toLowerCase().includes(normalizedFocusFilter)) ||
          focus.saying.categories.some((category) => category.text.toLowerCase().includes(normalizedFocusFilter))
  );
  const collectionFocusPageCount = Math.max(1, Math.ceil(filteredCollectionFoci.length / COLLECTION_FOCUS_PAGE_SIZE));
  const safeCollectionFocusPage = Math.min(collectionFocusPage, collectionFocusPageCount - 1);
  const pagedCollectionFoci = filteredCollectionFoci.slice(
    safeCollectionFocusPage * COLLECTION_FOCUS_PAGE_SIZE,
    (safeCollectionFocusPage + 1) * COLLECTION_FOCUS_PAGE_SIZE
  );
  const topPagedCollectionFoci = pagedCollectionFoci.slice(0, 4);
  const bottomPagedCollectionFoci = pagedCollectionFoci.slice(4, 8);
  const selectedCollectionFocus =
    filteredCollectionFoci.find((focus) => getFocusKey(focus) === selectedCollectionFocusKey) ?? filteredCollectionFoci[0] ?? null;

  const filteredFocusEditorImages = collectionImages.filter((image) =>
    normalizedFocusFilter.length === 0
      ? true
      : image.categories.some((category) => category.text.toLowerCase().includes(normalizedFocusFilter))
  );
  const focusEditorImagePageCount = Math.max(1, Math.ceil(filteredFocusEditorImages.length / FOCUS_EDITOR_IMAGE_PAGE_SIZE));
  const safeFocusEditorImagePage = Math.min(focusEditorImagePage, focusEditorImagePageCount - 1);
  const pagedFocusEditorImages = filteredFocusEditorImages.slice(
    safeFocusEditorImagePage * FOCUS_EDITOR_IMAGE_PAGE_SIZE,
    (safeFocusEditorImagePage + 1) * FOCUS_EDITOR_IMAGE_PAGE_SIZE
  );
  const topPagedFocusEditorImages = pagedFocusEditorImages.slice(0, 4);
  const bottomPagedFocusEditorImages = pagedFocusEditorImages.slice(4, 8);
  const selectedFocusEditorImage =
    filteredFocusEditorImages.find((image) => image.id === selectedFocusEditorImageId) ?? filteredFocusEditorImages[0] ?? null;

  const filteredFocusEditorSayings = collectionSayings.filter((saying) =>
    normalizedFocusFilter.length === 0
      ? true
      : saying.categories.some((category) => category.text.toLowerCase().includes(normalizedFocusFilter))
  );
  const focusEditorSayingPageCount = Math.max(1, Math.ceil(filteredFocusEditorSayings.length / FOCUS_EDITOR_SAYING_PAGE_SIZE));
  const safeFocusEditorSayingPage = Math.min(focusEditorSayingPage, focusEditorSayingPageCount - 1);
  const pagedFocusEditorSayings = filteredFocusEditorSayings.slice(
    safeFocusEditorSayingPage * FOCUS_EDITOR_SAYING_PAGE_SIZE,
    (safeFocusEditorSayingPage + 1) * FOCUS_EDITOR_SAYING_PAGE_SIZE
  );
  const selectedFocusEditorSaying =
    filteredFocusEditorSayings.find((saying) => saying.id === selectedFocusEditorSayingId) ?? filteredFocusEditorSayings[0] ?? null;
  const selectedEditorFocusKey =
    selectedFocusEditorImage && selectedFocusEditorSaying
      ? `${selectedFocusEditorSaying.id}:${selectedFocusEditorImage.id}`
      : null;
  const existingEditorFocus =
    selectedEditorFocusKey === null
      ? null
      : collectionFoci.find((focus) => getFocusKey(focus) === selectedEditorFocusKey) ?? null;
  const editorPreviewFocus =
    selectedFocusEditorImage && selectedFocusEditorSaying
      ? existingEditorFocus ?? {
          image: selectedFocusEditorImage,
          notes: '',
          rating: 0,
          saying: selectedFocusEditorSaying,
        }
      : null;
  const previewFocus =
    focusPreviewSource === 'editor'
      ? editorPreviewFocus ?? selectedCollectionFocus
      : selectedCollectionFocus ?? editorPreviewFocus;
  const previewFocusKey = previewFocus ? getFocusKey(previewFocus) : null;
  const storedPreviewFocus =
    previewFocusKey === null ? null : collectionFoci.find((focus) => getFocusKey(focus) === previewFocusKey) ?? null;
  const collectionImageById = new Map(collectionImages.map((image) => [image.id, image] as const));
  const filteredCollectionImages = IMAGES.filter((image) =>
    !isCollectionImageCategoryFilterActive || !selectedCollectionImageCategory
      ? true
      : image.categories.some((category) => category.text === selectedCollectionImageCategory)
  );
  const visibleCollectionImages = filteredCollectionImages.length > 0 ? filteredCollectionImages : lastVisibleCollectionImages;
  const selectedCollectionImage =
    visibleCollectionImages.find((image) => image.id === selectedCollectionImageId) ?? visibleCollectionImages[0] ?? null;
  const collectedImage = selectedCollectionImage ? collectionImageById.get(selectedCollectionImage.id) ?? null : null;
  const selectedImageDetails = collectedImage ?? selectedCollectionImage;
  const collectionImagePreviews = selectedCollectionImage
    ? visibleCollectionImages.filter((image) => image.id !== selectedCollectionImage.id)
    : visibleCollectionImages;
  const collectionImagePageCount = Math.max(1, Math.ceil(collectionImagePreviews.length / COLLECTION_IMAGE_PAGE_SIZE));
  const safeCollectionImagePage = Math.min(collectionImagePage, collectionImagePageCount - 1);
  const pagedCollectionImages = collectionImagePreviews.slice(
    safeCollectionImagePage * COLLECTION_IMAGE_PAGE_SIZE,
    (safeCollectionImagePage + 1) * COLLECTION_IMAGE_PAGE_SIZE
  );
  const topPagedCollectionImages = pagedCollectionImages.slice(0, 4);
  const bottomPagedCollectionImages = pagedCollectionImages.slice(4, 8);
  const zoomedImage = zoomedImageId === null ? null : IMAGES.find((image) => image.id === zoomedImageId) ?? null;

  const collectionSayingById = new Map(collectionSayings.map((saying) => [saying.id, saying] as const));
  const isFocusEditorMode = focusListMode !== 'foci';
  const activeFocusListPage = focusListMode === 'foci' ? safeCollectionFocusPage : focusListMode === 'images' ? safeFocusEditorImagePage : safeFocusEditorSayingPage;
  const activeFocusListPageCount =
    focusListMode === 'foci' ? collectionFocusPageCount : focusListMode === 'images' ? focusEditorImagePageCount : focusEditorSayingPageCount;
  const collectionMindsetListLength =
    mindsetListMode === 'mindsets' ? collectionMindsets.length + 1 : collectionFoci.length;
  const collectionMindsetPageCount = Math.max(1, Math.ceil(collectionMindsetListLength / COLLECTION_MINDSET_PAGE_SIZE));
  const activeCollectionModePage = mindsetListMode === 'mindsets' ? collectionMindsetPage : collectionModeFocusPage;
  const safeCollectionMindsetPage = Math.min(activeCollectionModePage, collectionMindsetPageCount - 1);
  const pagedCollectionMindsets =
    mindsetListMode === 'mindsets'
      ? collectionMindsets.slice(
          safeCollectionMindsetPage * COLLECTION_MINDSET_PAGE_SIZE,
          (safeCollectionMindsetPage + 1) * COLLECTION_MINDSET_PAGE_SIZE
        )
      : [];
  const pagedCollectionModeFoci =
    mindsetListMode === 'foci'
      ? collectionFoci.slice(
          safeCollectionMindsetPage * COLLECTION_MINDSET_PAGE_SIZE,
          (safeCollectionMindsetPage + 1) * COLLECTION_MINDSET_PAGE_SIZE
        )
      : [];
  const visibleCollectionMindsetSlots = Array.from({ length: COLLECTION_MINDSET_PAGE_SIZE }, (_, index) =>
    mindsetListMode === 'mindsets' ? (pagedCollectionMindsets[index] ?? null) : (pagedCollectionModeFoci[index] ?? null)
  );
  const safeSelectedCollectionMindsetIndex = Math.min(
    Math.max(selectedCollectionMindsetIndex, 0),
    Math.max(collectionMindsets.length - 1, 0)
  );
  const selectedCollectionMindset = collectionMindsets[safeSelectedCollectionMindsetIndex] ?? null;
  const activeMindsetDraftCategories = Array.from(
    new Set(
      draftMindsetFoci
        .flatMap((focus) => focus?.saying.categories.map((category) => category.text.trim()) ?? [])
        .filter(Boolean)
    )
  ).sort((left, right) => left.localeCompare(right, 'de'));
  const selectedCollectionMindsetCategories = selectedCollectionMindset
    ? Array.from(
        new Set(
          selectedCollectionMindset.foci.flatMap((focus) => focus.saying.categories.map((category) => category.text.trim())).filter(Boolean)
        )
      ).sort((left, right) => left.localeCompare(right, 'de'))
    : [];
  const filteredCollectionSayings = useMemo(
    () =>
      normalizedSayingFilter.length === 0
        ? SAYINGS
        : [
            ...SAYINGS.filter((saying) => saying.text.toLowerCase().includes(normalizedSayingFilter)),
            ...SAYINGS.filter(
              (saying) =>
                !saying.text.toLowerCase().includes(normalizedSayingFilter) &&
                saying.categories.some((category) => category.text.toLowerCase().includes(normalizedSayingFilter))
            ),
          ],
    [normalizedSayingFilter]
  );
  const collectionSayingPageCount = Math.max(1, Math.ceil(filteredCollectionSayings.length / COLLECTION_SAYING_PAGE_SIZE));
  const safeCollectionSayingPage = Math.min(collectionSayingPage, collectionSayingPageCount - 1);
  const pagedCollectionSayings = filteredCollectionSayings.slice(
    safeCollectionSayingPage * COLLECTION_SAYING_PAGE_SIZE,
    (safeCollectionSayingPage + 1) * COLLECTION_SAYING_PAGE_SIZE
  );
  const visibleMindsetEditorSlots = Array.from({ length: 5 }, (_, index) =>
    isEditingMindsetDraft ? draftMindsetFoci[index] ?? null : selectedCollectionMindset?.foci[index] ?? null
  );
  const isCreatingMindsetDraft = isEditingMindsetDraft && editingMindsetIndex === null;

  const handleSetSelectedImageRating = (rating: number) => {
    if (!selectedCollectionImage) {
      return;
    }

    if (!collectedImage) {
      addCollectionImage({ ...selectedCollectionImage, rating });
      return;
    }

    setCollectionImageRating(selectedCollectionImage.id, rating);
  };

  const handleSetSayingRating = (saying: Saying, rating: number) => {
    const existingSaying = collectionSayingById.get(saying.id) ?? null;

    if (!existingSaying) {
      addCollectionSaying({ ...saying, rating });
      return;
    }

    setCollectionSayingRating(saying.id, rating);
  };

  const handleSetFocusRating = (focus: Focus, rating: number) => {
    if (rating === 0) {
      setSelectedFocusEditorImageId(focus.image.id);
      setSelectedFocusEditorSayingId(focus.saying.id);
      setFocusPreviewSource('editor');
      removeCollectionFocus(getFocusKey(focus));
      return;
    }

    setCollectionFocusRating(getFocusKey(focus), rating);
  };

  const handleSetEditorFocusRating = (rating: number) => {
    if (!editorPreviewFocus) {
      return;
    }

    if (existingEditorFocus) {
      const existingFocusKey = getFocusKey(existingEditorFocus);

      if (rating === 0) {
        removeCollectionFocus(existingFocusKey);
        setFocusPreviewSource('editor');
        return;
      }

      shouldSyncFocusPageRef.current = true;
      setCollectionFocusRating(existingFocusKey, rating);
      setSelectedCollectionFocusKey(existingFocusKey);
      setFocusPreviewSource('focus');
      return;
    }

    const nextFocus = {
      ...editorPreviewFocus,
      rating,
    };

    addCollectionFocus(nextFocus);
    shouldSyncFocusPageRef.current = true;
    setSelectedCollectionFocusKey(getFocusKey(nextFocus));
    setCollectionFocusPage(Math.max(0, Math.ceil((filteredCollectionFoci.length + 1) / COLLECTION_FOCUS_PAGE_SIZE) - 1));
    setFocusPreviewSource('focus');
  };

  const toggleFocusEditorMode = () => {
    if (isFocusEditorMode) {
      setFocusListMode('foci');
      setFocusPreviewSource('focus');
      return;
    }

    setFocusListMode('images');
  };

  const showFocusImageList = () => {
    setFocusListMode('images');
  };

  const showFocusSayingList = () => {
    setFocusListMode('sayings');
  };

  const startMindsetDraft = () => {
    setIsEditingMindsetDraft(true);
    setEditingMindsetIndex(null);
    setDraftMindsetName('Neues Mindset');
    setDraftMindsetRating(0);
    setDraftMindsetFoci(emptyDraftSlots());
    setSelectedDraftMindsetSlot(0);
    setMindsetListMode('foci');
    setCollectionMindsetPage(0);
  };

  const loadMindsetIntoEditor = (mindset: Mindset, index: number) => {
    setSelectedCollectionMindsetIndex(index);
    setIsEditingMindsetDraft(true);
    setEditingMindsetIndex(index);
    setDraftMindsetName(mindset.name);
    setDraftMindsetRating(mindset.rating);
    setDraftMindsetFoci(Array.from({ length: 5 }, (_, slotIndex) => mindset.foci[slotIndex] ?? null));
    setSelectedDraftMindsetSlot(0);
  };

  const handleDraftFocusAssignment = (focus: Focus) => {
    if (!isEditingMindsetDraft) {
      return;
    }

    setDraftMindsetFoci((current) => {
      const nextFoci = current.map((entry, index) => (index === selectedDraftMindsetSlot ? focus : entry));

      if (editingMindsetIndex !== null) {
        updateMindset(editingMindsetIndex, {
          foci: nextFoci.filter((entry): entry is Focus => entry !== null),
          name: draftMindsetName.trim() || 'Neues Mindset',
          rating: draftMindsetRating,
        });
      }

      return nextFoci;
    });
  };

  const handleSetMindsetRating = (rating: number) => {
    if (isEditingMindsetDraft) {
      setDraftMindsetRating(rating);

      if (rating === 0) {
        if (editingMindsetIndex !== null) {
          removeMindset(editingMindsetIndex);
          setEditingMindsetIndex(null);
        }

        return;
      }

      const nextFoci = draftMindsetFoci.filter((focus): focus is Focus => focus !== null);

      if (nextFoci.length === 0) {
        return;
      }

      if (editingMindsetIndex === null) {
        addMindset({
          foci: nextFoci,
          name: draftMindsetName.trim() || 'Neues Mindset',
          notes: '',
          rating,
        });
        setEditingMindsetIndex(collectionMindsets.length);
        setSelectedCollectionMindsetIndex(collectionMindsets.length);
        return;
      }

      updateMindset(editingMindsetIndex, {
        foci: nextFoci,
        name: draftMindsetName.trim() || 'Neues Mindset',
        rating,
      });
      return;
    }

    if (!selectedCollectionMindset) {
      return;
    }

    if (rating === 0) {
      removeMindset(safeSelectedCollectionMindsetIndex);
      setIsEditingMindsetDraft(false);
      setEditingMindsetIndex(null);
      return;
    }

    setMindsetRating(safeSelectedCollectionMindsetIndex, rating);
  };

  const handleDraftMindsetNameChange = (name: string) => {
    setDraftMindsetName(name);

    if (editingMindsetIndex !== null) {
      updateMindset(editingMindsetIndex, { name });
    }
  };

  useEffect(() => {
    if (activeTab !== 'mindsets') {
      return;
    }

    if (isCreatingMindsetDraft) {
      return;
    }

    if (!selectedCollectionMindset) {
      setIsEditingMindsetDraft(false);
      setEditingMindsetIndex(null);
      return;
    }

    setIsEditingMindsetDraft(true);
    setEditingMindsetIndex(safeSelectedCollectionMindsetIndex);
    setDraftMindsetName(selectedCollectionMindset.name);
    setDraftMindsetRating(selectedCollectionMindset.rating);
    setDraftMindsetFoci(Array.from({ length: 5 }, (_, index) => selectedCollectionMindset.foci[index] ?? null));
  }, [activeTab, isCreatingMindsetDraft, safeSelectedCollectionMindsetIndex, selectedCollectionMindset]);

  useEffect(() => {
    void preloadImages(IMAGES.map((image) => getPreviewImageUrl(image.url)));
  }, []);

  useEffect(() => {
    if (collectionFocusPage !== safeCollectionFocusPage) {
      setCollectionFocusPage(safeCollectionFocusPage);
    }
  }, [collectionFocusPage, safeCollectionFocusPage]);

  useEffect(() => {
    setCollectionFocusPage(0);
  }, [normalizedFocusFilter]);

  useEffect(() => {
    if (!shouldSyncFocusPageRef.current || !selectedCollectionFocusKey) {
      return;
    }

    const selectedFocusIndex = filteredCollectionFoci.findIndex((focus) => getFocusKey(focus) === selectedCollectionFocusKey);

    if (selectedFocusIndex < 0) {
      shouldSyncFocusPageRef.current = false;
      return;
    }

    const nextPage = Math.floor(selectedFocusIndex / COLLECTION_FOCUS_PAGE_SIZE);
    shouldSyncFocusPageRef.current = false;

    if (collectionFocusPage !== nextPage) {
      setCollectionFocusPage(nextPage);
    }
  }, [collectionFocusPage, filteredCollectionFoci, selectedCollectionFocusKey]);

  useEffect(() => {
    if (focusEditorImagePage !== safeFocusEditorImagePage) {
      setFocusEditorImagePage(safeFocusEditorImagePage);
    }
  }, [focusEditorImagePage, safeFocusEditorImagePage]);

  useEffect(() => {
    setFocusEditorImagePage(0);
  }, [normalizedFocusFilter]);

  useEffect(() => {
    if (selectedFocusEditorImageId === null && filteredFocusEditorImages[0]) {
      setSelectedFocusEditorImageId(filteredFocusEditorImages[0].id);
      return;
    }

    if (
      selectedFocusEditorImageId !== null &&
      filteredFocusEditorImages.length > 0 &&
      !filteredFocusEditorImages.some((image) => image.id === selectedFocusEditorImageId)
    ) {
      setSelectedFocusEditorImageId(filteredFocusEditorImages[0].id);
    }
  }, [filteredFocusEditorImages, selectedFocusEditorImageId]);

  useEffect(() => {
    if (focusEditorSayingPage !== safeFocusEditorSayingPage) {
      setFocusEditorSayingPage(safeFocusEditorSayingPage);
    }
  }, [focusEditorSayingPage, safeFocusEditorSayingPage]);

  useEffect(() => {
    setFocusEditorSayingPage(0);
  }, [normalizedFocusFilter]);

  useEffect(() => {
    if (selectedFocusEditorSayingId === null && filteredFocusEditorSayings[0]) {
      setSelectedFocusEditorSayingId(filteredFocusEditorSayings[0].id);
      return;
    }

    if (
      selectedFocusEditorSayingId !== null &&
      filteredFocusEditorSayings.length > 0 &&
      !filteredFocusEditorSayings.some((saying) => saying.id === selectedFocusEditorSayingId)
    ) {
      setSelectedFocusEditorSayingId(filteredFocusEditorSayings[0].id);
    }
  }, [filteredFocusEditorSayings, selectedFocusEditorSayingId]);

  useEffect(() => {
    if (selectedCollectionFocusKey === null && filteredCollectionFoci[0]) {
      setSelectedCollectionFocusKey(getFocusKey(filteredCollectionFoci[0]));
      return;
    }

    if (
      selectedCollectionFocusKey !== null &&
      filteredCollectionFoci.length > 0 &&
      !filteredCollectionFoci.some((focus) => getFocusKey(focus) === selectedCollectionFocusKey)
    ) {
      setSelectedCollectionFocusKey(getFocusKey(filteredCollectionFoci[0]));
    }
  }, [filteredCollectionFoci, selectedCollectionFocusKey]);

  useEffect(() => {
    if (!selectedCollectionImage) {
      return;
    }

    void preloadImages([selectedCollectionImage.url]);
  }, [selectedCollectionImage]);

  useEffect(() => {
    if (filteredCollectionImages.length > 0) {
      setLastVisibleCollectionImages(filteredCollectionImages);
    }
  }, [filteredCollectionImages]);

  useEffect(() => {
    if (collectionImagePage !== safeCollectionImagePage) {
      setCollectionImagePage(safeCollectionImagePage);
    }
  }, [collectionImagePage, safeCollectionImagePage]);

  useEffect(() => {
    setCollectionImagePage(0);
  }, [isCollectionImageCategoryFilterActive, selectedCollectionImageCategory]);

  useEffect(() => {
    if (availableImageCategories.length === 0) {
      return;
    }

    if (selectedCollectionImageCategoryIndex >= availableImageCategories.length) {
      setSelectedCollectionImageCategoryIndex(availableImageCategories.length - 1);
    }
  }, [availableImageCategories, selectedCollectionImageCategoryIndex]);

  useEffect(() => {
    if (selectedCollectionImageId === null && filteredCollectionImages[0]) {
      setSelectedCollectionImageId(filteredCollectionImages[0].id);
      return;
    }

    if (
      selectedCollectionImageId !== null &&
      filteredCollectionImages.length > 0 &&
      !filteredCollectionImages.some((image) => image.id === selectedCollectionImageId)
    ) {
      setSelectedCollectionImageId(filteredCollectionImages[0].id);
    }
  }, [filteredCollectionImages, selectedCollectionImageId]);

  useEffect(() => {
    if (collectionSayingPage !== safeCollectionSayingPage) {
      setCollectionSayingPage(safeCollectionSayingPage);
    }
  }, [collectionSayingPage, safeCollectionSayingPage]);

  useEffect(() => {
    setCollectionSayingPage(0);
  }, [normalizedSayingFilter]);

  useEffect(() => {
    if (selectedCollectionSayingId === null && filteredCollectionSayings[0]) {
      setSelectedCollectionSayingId(filteredCollectionSayings[0].id);
      return;
    }

    if (
      selectedCollectionSayingId !== null &&
      filteredCollectionSayings.length > 0 &&
      !filteredCollectionSayings.some((saying) => saying.id === selectedCollectionSayingId)
    ) {
      setSelectedCollectionSayingId(filteredCollectionSayings[0].id);
    }
  }, [filteredCollectionSayings, selectedCollectionSayingId]);

  useEffect(() => {
    if (mindsetListMode === 'mindsets' && collectionMindsetPage !== safeCollectionMindsetPage) {
      setCollectionMindsetPage(safeCollectionMindsetPage);
    }

    if (mindsetListMode === 'foci' && collectionModeFocusPage !== safeCollectionMindsetPage) {
      setCollectionModeFocusPage(safeCollectionMindsetPage);
    }
  }, [collectionMindsetPage, collectionModeFocusPage, mindsetListMode, safeCollectionMindsetPage]);

  useEffect(() => {
    if (selectedCollectionMindsetIndex !== safeSelectedCollectionMindsetIndex) {
      setSelectedCollectionMindsetIndex(safeSelectedCollectionMindsetIndex);
    }
  }, [safeSelectedCollectionMindsetIndex, selectedCollectionMindsetIndex]);

  return (
    <section className="mt-6 space-y-5">
      <Tabs
        activeValue={activeTab}
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        items={[...COLLECTION_TABS]}
        onChange={setActiveTab}
      />

      <section>
        {activeTab === 'images' ? (
          selectedCollectionImage && selectedImageDetails ? (
            <div className="grid gap-x-5 gap-y-4 min-[900px]:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] min-[900px]:items-start">
              <div className="min-[900px]:col-span-2 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    aria-label="Vorherige Bildkategorie"
                    className="px-4 py-2 font-semibold tracking-tight"
                    disabled={availableImageCategories.length <= 1}
                    fullWidth
                    onClick={() =>
                      setSelectedCollectionImageCategoryIndex((currentIndex) =>
                        availableImageCategories.length === 0
                          ? 0
                          : (currentIndex - 1 + availableImageCategories.length) % availableImageCategories.length
                      )
                    }
                    shape="pill"
                    variant="pager"
                  >
                    ←
                  </Button>
                  <Button
                    active={isCollectionImageCategoryFilterActive}
                    aria-label={`Bildkategorie ${selectedCollectionImageCategory || 'Unsortiert'} umschalten`}
                    className="truncate px-4 py-2 text-lg font-semibold tracking-tight"
                    fullWidth
                    onClick={() => setIsCollectionImageCategoryFilterActive((current) => !current)}
                    shape="pill"
                    variant="tab"
                  >
                    {selectedCollectionImageCategory || 'Unsortiert'}
                  </Button>
                  <Button
                    aria-label="Nächste Bildkategorie"
                    className="px-4 py-2 font-semibold tracking-tight"
                    disabled={availableImageCategories.length <= 1}
                    fullWidth
                    onClick={() =>
                      setSelectedCollectionImageCategoryIndex((currentIndex) =>
                        availableImageCategories.length === 0 ? 0 : (currentIndex + 1) % availableImageCategories.length
                      )
                    }
                    shape="pill"
                    variant="pager"
                  >
                    →
                  </Button>
                </div>

                <div>
                  {visibleCollectionImages.length > 0 ? (
                    <div className="flex items-center gap-3">
                      <Button
                        aria-label="Vorherige Bildseite"
                        className="flex-1"
                        disabled={safeCollectionImagePage === 0}
                        fullWidth
                        onClick={() => setCollectionImagePage((page) => Math.max(0, page - 1))}
                        shape="pill"
                        variant="pager"
                      >
                        ←
                      </Button>
                      <div className="min-w-[6rem] text-center text-base font-semibold text-muted">
                        {safeCollectionImagePage + 1} / {collectionImagePageCount}
                      </div>
                      <Button
                        aria-label="Nächste Bildseite"
                        className="flex-1"
                        disabled={safeCollectionImagePage >= collectionImagePageCount - 1}
                        fullWidth
                        onClick={() => setCollectionImagePage((page) => Math.min(collectionImagePageCount - 1, page + 1))}
                        shape="pill"
                        variant="pager"
                      >
                        →
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>

              <section className="flex min-h-0 flex-col min-[900px]:col-span-2">
                <div className="space-y-3 min-[900px]:hidden">
                  <CollectionImagePanel
                    image={selectedImageDetails}
                    onOpenModal={() => setZoomedImageId(selectedCollectionImage.id)}
                    onSetRating={handleSetSelectedImageRating}
                    showImageId={showCollectionImageIds}
                  />

                  {pagedCollectionImages.length > 0 ? (
                    <SelectableTileGrid
                      getKey={(image) => image.id}
                      items={pagedCollectionImages}
                      onSelect={(image) => setSelectedCollectionImageId(image.id)}
                      renderTile={(image) => {
                        const collectedListImage = collectionImageById.get(image.id) ?? null;
                        const previewRating = collectedListImage?.rating ?? 0;

                        return (
                          <ImageTile
                            image={{ ...image, rating: previewRating }}
                            imageUrl={getPreviewImageUrl(image.url)}
                            rating={previewRating}
                            showImageId={showCollectionImageIds}
                          />
                        );
                      }}
                      variant="eight"
                    />
                  ) : null}
                </div>

                <div className="hidden min-[900px]:grid min-[900px]:grid-cols-4 min-[900px]:gap-3">
                  <div className="min-[900px]:col-span-2 min-[900px]:row-span-2">
                    <CollectionImagePanel
                      image={selectedImageDetails}
                      onOpenModal={() => setZoomedImageId(selectedCollectionImage.id)}
                      onSetRating={handleSetSelectedImageRating}
                      panelClassName="h-full"
                      showImageId={showCollectionImageIds}
                    />
                  </div>

                  <div className="min-[900px]:col-span-2">
                    <SelectableTileGrid
                      desktopColumns={2}
                      getKey={(image) => image.id}
                      items={topPagedCollectionImages}
                      onSelect={(image) => setSelectedCollectionImageId(image.id)}
                      renderTile={(image) => {
                        const collectedListImage = collectionImageById.get(image.id) ?? null;
                        const previewRating = collectedListImage?.rating ?? 0;

                        return (
                          <ImageTile
                            image={{ ...image, rating: previewRating }}
                            imageUrl={getPreviewImageUrl(image.url)}
                            rating={previewRating}
                            showImageId={showCollectionImageIds}
                          />
                        );
                      }}
                      variant="four"
                    />
                  </div>

                  <div className="min-[900px]:col-span-4">
                    <SelectableTileGrid
                      desktopColumns={4}
                      getKey={(image) => image.id}
                      items={bottomPagedCollectionImages}
                      onSelect={(image) => setSelectedCollectionImageId(image.id)}
                      renderTile={(image) => {
                        const collectedListImage = collectionImageById.get(image.id) ?? null;
                        const previewRating = collectedListImage?.rating ?? 0;

                        return (
                          <ImageTile
                            image={{ ...image, rating: previewRating }}
                            imageUrl={getPreviewImageUrl(image.url)}
                            rating={previewRating}
                            showImageId={showCollectionImageIds}
                          />
                        );
                      }}
                      variant="four"
                    />
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="mt-5 rounded-[22px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
              <p className="text-sm text-muted">Für diesen Filter sind keine Bilder verfügbar.</p>
            </div>
          )
        ) : activeTab === 'sayings' ? (
          filteredCollectionSayings.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 items-center">
                <label className="block" htmlFor="collection-saying-filter">
                  <input
                    id="collection-saying-filter"
                    className="min-h-[3.75rem] w-full border border-amber-950/10 bg-white/90 px-4 py-3 text-lg font-semibold tracking-tight text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="Suchbegriff/Kategorie"
                    value={collectionSayingFilter}
                    onChange={(event) => setCollectionSayingFilter(event.target.value)}
                  />
                </label>

                {filteredCollectionSayings.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <Button
                      aria-label="Vorherige Spruchseite"
                      className="flex-1"
                      disabled={safeCollectionSayingPage === 0}
                      fullWidth
                      onClick={() => setCollectionSayingPage((page) => Math.max(0, page - 1))}
                      shape="pill"
                      variant="pager"
                    >
                      ←
                    </Button>
                    <div className="min-w-[6rem] text-center text-base font-semibold text-muted">
                      {safeCollectionSayingPage + 1} / {collectionSayingPageCount}
                    </div>
                    <Button
                      aria-label="Nächste Spruchseite"
                      className="flex-1"
                      disabled={safeCollectionSayingPage >= collectionSayingPageCount - 1}
                      fullWidth
                      onClick={() => setCollectionSayingPage((page) => Math.min(collectionSayingPageCount - 1, page + 1))}
                      shape="pill"
                      variant="pager"
                    >
                      →
                    </Button>
                  </div>
                ) : null}
              </div>

              <section className="flex min-h-0 flex-col">
                <div className="pr-1">
                  <CollectionSayingList
                    onSelect={(saying) => setSelectedCollectionSayingId(saying.id)}
                    onSetRating={handleSetSayingRating}
                    sayings={pagedCollectionSayings.map((saying) => {
                      const collectedListSaying = collectionSayingById.get(saying.id) ?? null;
                      const previewRating = collectedListSaying?.rating ?? 0;

                      return { ...saying, rating: previewRating };
                    })}
                    selectedSayingId={selectedCollectionSayingId}
                    showSayingId={showCollectionSayingIds}
                  />
                </div>
              </section>
            </div>
          ) : (
            <div className="mt-5 rounded-[22px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
              <p className="text-sm text-muted">Für diesen Filter sind keine Sprüche verfügbar.</p>
            </div>
          )
        ) : activeTab === 'foci' ? (
          previewFocus || filteredCollectionFoci.length > 0 || filteredFocusEditorImages.length > 0 || filteredFocusEditorSayings.length > 0 ? (
            <div className="space-y-8">
              <div className="grid gap-x-5 gap-y-4 min-[900px]:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] min-[900px]:items-start">
                <div className="space-y-3 min-[900px]:col-span-2">
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      aria-label="Vorherige Fokuskategorie"
                      className="px-4 py-2 font-semibold tracking-tight"
                      disabled={availableFocusCategories.length <= 1}
                      fullWidth
                      onClick={() =>
                        setSelectedCollectionFocusCategoryIndex((currentIndex) =>
                          availableFocusCategories.length === 0
                            ? 0
                            : (currentIndex - 1 + availableFocusCategories.length) % availableFocusCategories.length
                        )
                      }
                      shape="pill"
                      variant="pager"
                    >
                      ←
                    </Button>
                    <Button
                      active={isCollectionFocusCategoryFilterActive}
                      aria-label={`Fokuskategorie ${selectedCollectionFocusCategory || 'Unsortiert'} umschalten`}
                      className="truncate px-4 py-2 text-lg font-semibold tracking-tight"
                      fullWidth
                      onClick={() => setIsCollectionFocusCategoryFilterActive((current) => !current)}
                      shape="pill"
                      variant="tab"
                    >
                      {selectedCollectionFocusCategory || 'Unsortiert'}
                    </Button>
                    <Button
                      aria-label="Nächste Fokuskategorie"
                      className="px-4 py-2 font-semibold tracking-tight"
                      disabled={availableFocusCategories.length <= 1}
                      fullWidth
                      onClick={() =>
                        setSelectedCollectionFocusCategoryIndex((currentIndex) =>
                          availableFocusCategories.length === 0 ? 0 : (currentIndex + 1) % availableFocusCategories.length
                        )
                      }
                      shape="pill"
                      variant="pager"
                    >
                      →
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <Button
                      aria-label={isFocusEditorMode ? 'Zur Fokussliste wechseln' : 'Editor aktivieren'}
                      className="col-span-2 px-4 py-2 text-lg font-semibold tracking-tight"
                      fullWidth
                      onClick={toggleFocusEditorMode}
                      shape="pill"
                      variant="tab"
                    >
                      {isFocusEditorMode ? '← Fokusse' : 'Edit →'}
                    </Button>
                    <Button
                      active={focusListMode === 'images'}
                      aria-label="Bildliste im Editor anzeigen"
                      className="px-4 py-2 text-lg font-semibold tracking-tight"
                      disabled={!isFocusEditorMode}
                      fullWidth
                      onClick={showFocusImageList}
                      shape="pill"
                      variant="tab"
                    >
                      Bilder
                    </Button>
                    <Button
                      active={focusListMode === 'sayings'}
                      aria-label="Spruchliste im Editor anzeigen"
                      className="px-4 py-2 text-lg font-semibold tracking-tight"
                      disabled={!isFocusEditorMode}
                      fullWidth
                      onClick={showFocusSayingList}
                      shape="pill"
                      variant="tab"
                    >
                      Sprüche
                    </Button>
                  </div>

                  {((focusListMode === 'foci' && filteredCollectionFoci.length > 0) ||
                    (focusListMode === 'images' && filteredFocusEditorImages.length > 0) ||
                    (focusListMode === 'sayings' && filteredFocusEditorSayings.length > 0)) ? (
                    <div className="flex items-center gap-3">
                      <Button
                        aria-label={
                          focusListMode === 'foci'
                            ? 'Vorherige Fokusseite'
                            : focusListMode === 'images'
                              ? 'Vorherige Bildseite'
                              : 'Vorherige Spruchseite'
                        }
                        className="flex-1"
                        disabled={activeFocusListPage === 0}
                        fullWidth
                        onClick={() => {
                          if (focusListMode === 'foci') {
                            setCollectionFocusPage((page) => Math.max(0, page - 1));
                            return;
                          }

                          if (focusListMode === 'images') {
                            setFocusEditorImagePage((page) => Math.max(0, page - 1));
                            return;
                          }

                          setFocusEditorSayingPage((page) => Math.max(0, page - 1));
                        }}
                        shape="pill"
                        variant="pager"
                      >
                        ←
                      </Button>
                      <div className="min-w-[6rem] text-center text-base font-semibold text-muted">
                        {activeFocusListPage + 1} / {activeFocusListPageCount}
                      </div>
                      <Button
                        aria-label={
                          focusListMode === 'foci'
                            ? 'Nächste Fokusseite'
                            : focusListMode === 'images'
                              ? 'Nächste Bildseite'
                              : 'Nächste Spruchseite'
                        }
                        className="flex-1"
                        disabled={activeFocusListPage >= activeFocusListPageCount - 1}
                        fullWidth
                        onClick={() => {
                          if (focusListMode === 'foci') {
                            setCollectionFocusPage((page) => Math.min(collectionFocusPageCount - 1, page + 1));
                            return;
                          }

                          if (focusListMode === 'images') {
                            setFocusEditorImagePage((page) => Math.min(focusEditorImagePageCount - 1, page + 1));
                            return;
                          }

                          setFocusEditorSayingPage((page) => Math.min(focusEditorSayingPageCount - 1, page + 1));
                        }}
                        shape="pill"
                        variant="pager"
                      >
                        →
                      </Button>
                    </div>
                  ) : null}
                </div>

                <section className="flex min-h-0 flex-col min-[900px]:col-span-2">
                  <div className="space-y-3 min-[900px]:hidden">
                    {previewFocus ? (
                      <div className="relative">
                        <FocusTile
                          focus={{ ...previewFocus, rating: storedPreviewFocus?.rating ?? previewFocus.rating }}
                          onSetRating={
                            focusPreviewSource === 'editor'
                              ? handleSetEditorFocusRating
                              : storedPreviewFocus
                                ? (rating) => handleSetFocusRating(storedPreviewFocus, rating)
                                : undefined
                          }
                          variant="main"
                        />
                        <Button
                          aria-label="Vergrößertes Bild öffnen"
                          className={`absolute right-6 top-6 z-20 h-[5.25rem] w-[5.25rem] ${getImageIdBadgeClassName(
                            getImageOverlayTone(previewFocus.image.color)
                          )}`}
                          onClick={() => setZoomedImageId(previewFocus.image.id)}
                          shape="round"
                          tone={getImageOverlayTone(previewFocus.image.color)}
                          variant="overlay-action"
                        >
                          <svg
                            aria-hidden="true"
                            className="h-9 w-9"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M16 16L21 21" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                          </svg>
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-[28px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
                        <p className="text-sm text-muted">Wähle unten ein Bild und einen Spruch oder rechts einen bestehenden Fokus.</p>
                      </div>
                    )}

                    {focusListMode === 'foci' && filteredCollectionFoci.length > 0 ? (
                      <SelectableTileGrid
                        getKey={(focus) => getFocusKey(focus)}
                        isSelected={(focus) => getFocusKey(focus) === (selectedCollectionFocus ? getFocusKey(selectedCollectionFocus) : null)}
                        items={pagedCollectionFoci}
                        onSelect={(focus) => {
                          setSelectedCollectionFocusKey(getFocusKey(focus));
                          setFocusPreviewSource('focus');
                        }}
                        renderTile={(focus) => (
                          <FocusTile focus={{ ...focus, image: { ...focus.image, url: getPreviewImageUrl(focus.image.url) } }} />
                        )}
                        variant="eight"
                      />
                    ) : focusListMode === 'images' && filteredFocusEditorImages.length > 0 ? (
                      <SelectableTileGrid
                        getKey={(image) => image.id}
                        isSelected={(image) => image.id === selectedFocusEditorImage?.id}
                        items={pagedFocusEditorImages}
                        onSelect={(image) => {
                          setSelectedFocusEditorImageId(image.id);
                          setFocusPreviewSource('editor');
                        }}
                        renderTile={(image) => <ImageTile image={image} imageUrl={getPreviewImageUrl(image.url)} />}
                        variant="eight"
                      />
                    ) : focusListMode === 'sayings' && filteredFocusEditorSayings.length > 0 ? (
                      <CollectionSayingList
                        layout="focus-eight"
                        onSelect={(saying) => {
                          setSelectedFocusEditorSayingId(saying.id);
                          setFocusPreviewSource('editor');
                        }}
                        onSetRating={handleSetSayingRating}
                        sayings={pagedFocusEditorSayings}
                        selectedSayingId={selectedFocusEditorSaying?.id ?? null}
                      />
                    ) : focusListMode === 'foci' ? null : (
                      <div className="rounded-[20px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
                        <p className="text-sm text-muted">
                          {focusListMode === 'images'
                              ? 'In deiner Sammlung passen keine Bilder zu diesem Filter.'
                              : 'In deiner Sammlung passen keine Sprüche zu diesem Filter.'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="hidden min-[900px]:grid min-[900px]:grid-cols-4 min-[900px]:gap-3">
                    {previewFocus ? (
                      <div className="relative min-[900px]:col-span-2 min-[900px]:row-span-2">
                        <FocusTile
                          focus={{ ...previewFocus, rating: storedPreviewFocus?.rating ?? previewFocus.rating }}
                          onSetRating={
                            focusPreviewSource === 'editor'
                              ? handleSetEditorFocusRating
                              : storedPreviewFocus
                                ? (rating) => handleSetFocusRating(storedPreviewFocus, rating)
                                : undefined
                          }
                          variant="main"
                        />
                        <Button
                          aria-label="Vergrößertes Bild öffnen"
                          className={`absolute right-6 top-6 z-20 h-[5.25rem] w-[5.25rem] ${getImageIdBadgeClassName(
                            getImageOverlayTone(previewFocus.image.color)
                          )}`}
                          onClick={() => setZoomedImageId(previewFocus.image.id)}
                          shape="round"
                          tone={getImageOverlayTone(previewFocus.image.color)}
                          variant="overlay-action"
                        >
                          <svg
                            aria-hidden="true"
                            className="h-9 w-9"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M16 16L21 21" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                          </svg>
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-[28px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center min-[900px]:col-span-2 min-[900px]:row-span-2">
                        <p className="text-sm text-muted">Wähle unten ein Bild und einen Spruch oder rechts einen bestehenden Fokus.</p>
                      </div>
                    )}

                    {focusListMode === 'foci' && filteredCollectionFoci.length > 0 ? (
                      <div className="min-[900px]:col-span-2">
                        <SelectableTileGrid
                          desktopColumns={2}
                          getKey={(focus) => getFocusKey(focus)}
                          isSelected={(focus) => getFocusKey(focus) === (selectedCollectionFocus ? getFocusKey(selectedCollectionFocus) : null)}
                          items={topPagedCollectionFoci}
                          onSelect={(focus) => {
                            setSelectedCollectionFocusKey(getFocusKey(focus));
                            setFocusPreviewSource('focus');
                          }}
                          renderTile={(focus) => (
                            <FocusTile focus={{ ...focus, image: { ...focus.image, url: getPreviewImageUrl(focus.image.url) } }} />
                          )}
                          variant="four"
                        />
                      </div>
                    ) : null}

                    {focusListMode === 'foci' && filteredCollectionFoci.length > 0 ? (
                      <div className="min-[900px]:col-span-4">
                        <SelectableTileGrid
                          desktopColumns={4}
                          getKey={(focus) => getFocusKey(focus)}
                          isSelected={(focus) => getFocusKey(focus) === (selectedCollectionFocus ? getFocusKey(selectedCollectionFocus) : null)}
                          items={bottomPagedCollectionFoci}
                          onSelect={(focus) => {
                            setSelectedCollectionFocusKey(getFocusKey(focus));
                            setFocusPreviewSource('focus');
                          }}
                          renderTile={(focus) => (
                            <FocusTile focus={{ ...focus, image: { ...focus.image, url: getPreviewImageUrl(focus.image.url) } }} />
                          )}
                          variant="four"
                        />
                      </div>
                    ) : focusListMode === 'images' && filteredFocusEditorImages.length > 0 ? (
                      <div className="min-[900px]:col-span-2">
                        <SelectableTileGrid
                          desktopColumns={2}
                          getKey={(image) => image.id}
                          isSelected={(image) => image.id === selectedFocusEditorImage?.id}
                          items={topPagedFocusEditorImages}
                          onSelect={(image) => {
                            setSelectedFocusEditorImageId(image.id);
                            setFocusPreviewSource('editor');
                          }}
                          renderTile={(image) => <ImageTile image={image} imageUrl={getPreviewImageUrl(image.url)} />}
                          variant="four"
                        />
                      </div>
                    ) : null}

                    {focusListMode === 'images' && filteredFocusEditorImages.length > 0 ? (
                      <div className="min-[900px]:col-span-4">
                        <SelectableTileGrid
                          desktopColumns={4}
                          getKey={(image) => image.id}
                          isSelected={(image) => image.id === selectedFocusEditorImage?.id}
                          items={bottomPagedFocusEditorImages}
                          onSelect={(image) => {
                            setSelectedFocusEditorImageId(image.id);
                            setFocusPreviewSource('editor');
                          }}
                          renderTile={(image) => <ImageTile image={image} imageUrl={getPreviewImageUrl(image.url)} />}
                          variant="four"
                        />
                      </div>
                    ) : focusListMode === 'sayings' && filteredFocusEditorSayings.length > 0 ? (
                      <div className="min-[900px]:col-span-2">
                        <CollectionSayingList
                          layout="focus-eight"
                          onSelect={(saying) => {
                            setSelectedFocusEditorSayingId(saying.id);
                            setFocusPreviewSource('editor');
                          }}
                          onSetRating={handleSetSayingRating}
                          sayings={pagedFocusEditorSayings}
                          selectedSayingId={selectedFocusEditorSaying?.id ?? null}
                        />
                      </div>
                    ) : focusListMode === 'foci' ? null : (
                      <div className="rounded-[20px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center min-[900px]:col-span-2">
                        <p className="text-sm text-muted">
                          {focusListMode === 'images'
                              ? 'In deiner Sammlung passen keine Bilder zu diesem Filter.'
                              : 'In deiner Sammlung passen keine Sprüche zu diesem Filter.'}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[22px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
              <p className="text-sm text-muted">In deiner Sammlung sind noch keine Fokusse verfügbar.</p>
            </div>
          )
        ) : activeTab === 'mindsets' ? (
          <div className="space-y-6">
            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Aktives Mindset</p>
                  {isEditingMindsetDraft ? (
                    <>
                      <input
                        className="mt-1 min-h-[3.75rem] w-full border border-amber-950/10 bg-white/90 px-4 py-3 text-lg font-semibold tracking-tight text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                        placeholder="Name"
                        value={draftMindsetName}
                        onChange={(event) => handleDraftMindsetNameChange(event.target.value)}
                      />
                      <p className="mt-2 text-sm text-muted">
                        {activeMindsetDraftCategories.join(' / ') || 'Wähle unten Fokusse und fülle damit die Slots.'}
                      </p>
                    </>
                  ) : selectedCollectionMindset ? (
                    <>
                      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">{selectedCollectionMindset.name}</p>
                      <p className="mt-2 text-sm text-muted">
                        {selectedCollectionMindsetCategories.join(' / ') || 'Unsortiert'}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">Noch kein Mindset</p>
                      <p className="mt-2 text-sm text-muted">Lege unten mit `+` ein neues Mindset an.</p>
                    </>
                  )}
                </div>
                <StarRating
                  rating={isEditingMindsetDraft ? draftMindsetRating : selectedCollectionMindset?.rating ?? 0}
                  tone="dark"
                  variant="mindset"
                  onChange={handleSetMindsetRating}
                />
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {visibleMindsetEditorSlots.map((focus, index) =>
                  focus ? (
                    <Button
                      align="left"
                      key={`${isEditingMindsetDraft ? 'draft' : selectedCollectionMindset.name}-${getFocusKey(focus)}-${index}`}
                      className="min-w-[150px] flex-1 overflow-hidden"
                      onClick={() => isEditingMindsetDraft && setSelectedDraftMindsetSlot(index)}
                      selected={isEditingMindsetDraft && selectedDraftMindsetSlot === index}
                      variant="surface"
                    >
                      <div className="relative">
                        <FocusTile focus={focus} />
                      </div>
                    </Button>
                  ) : (
                    <Button
                      align="left"
                      key={`draft-empty-slot-${index}`}
                      className="min-w-[150px] flex-1 overflow-hidden"
                      onClick={() => setSelectedDraftMindsetSlot(index)}
                      selected={selectedDraftMindsetSlot === index}
                      variant="surface"
                    >
                      <div className="flex aspect-[733/1024] flex-col items-center justify-center gap-3 border border-dashed border-amber-950/12 bg-[#fbf6ec] px-4 text-center">
                        <p className="text-sm font-semibold text-ink">Leeres Feld</p>
                        <p className="text-xs text-muted">Slot aktivieren und unten einen Fokus anklicken.</p>
                      </div>
                    </Button>
                  )
                )}
                {!isEditingMindsetDraft && !selectedCollectionMindset ? (
                  <div className="flex min-h-[12rem] w-full items-center justify-center border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 text-center text-sm text-muted">
                    Noch keine Fokusse im aktiven Mindset.
                  </div>
                ) : null}
              </div>
            </section>

            <section>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-center">
                <Tabs
                  activeValue={mindsetListMode}
                  className="grid grid-cols-2 gap-2"
                  items={[
                    { label: 'Mindsets', value: 'mindsets' },
                    { label: 'Fokusse', value: 'foci' },
                  ]}
                  onChange={setMindsetListMode}
                />

                <div className="flex items-center gap-3">
                  <Button
                    aria-label={`Vorherige ${mindsetListMode === 'mindsets' ? 'Mindset-' : 'Fokusse-'}Seite`}
                    className="flex-1"
                    disabled={safeCollectionMindsetPage === 0}
                    fullWidth
                    onClick={() =>
                      mindsetListMode === 'mindsets'
                        ? setCollectionMindsetPage((page) => Math.max(0, page - 1))
                        : setCollectionModeFocusPage((page) => Math.max(0, page - 1))
                    }
                    shape="pill"
                    variant="pager"
                  >
                    ←
                  </Button>
                  <div className="min-w-[6rem] text-center text-base font-semibold text-muted">
                    {safeCollectionMindsetPage + 1} / {collectionMindsetPageCount}
                  </div>
                  <Button
                    aria-label={`Nächste ${mindsetListMode === 'mindsets' ? 'Mindset-' : 'Fokusse-'}Seite`}
                    className="flex-1"
                    disabled={safeCollectionMindsetPage >= collectionMindsetPageCount - 1}
                    fullWidth
                    onClick={() =>
                      mindsetListMode === 'mindsets'
                        ? setCollectionMindsetPage((page) => Math.min(collectionMindsetPageCount - 1, page + 1))
                        : setCollectionModeFocusPage((page) => Math.min(collectionMindsetPageCount - 1, page + 1))
                    }
                    shape="pill"
                    variant="pager"
                  >
                    →
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {visibleCollectionMindsetSlots.map((entry, slotIndex) => {
                  const absoluteIndex = safeCollectionMindsetPage * COLLECTION_MINDSET_PAGE_SIZE + slotIndex;

                  if (mindsetListMode === 'mindsets' && absoluteIndex === collectionMindsets.length) {
                    return (
                      <Button
                        key={`new-mindset-slot-${absoluteIndex}`}
                        className="min-w-[170px] flex-1 overflow-hidden"
                        onClick={startMindsetDraft}
                        selected={isCreatingMindsetDraft}
                        variant="surface"
                      >
                        <div className="flex aspect-[733/1024] items-center justify-center border border-dashed border-amber-950/14 bg-[#fbf6ec]">
                          <span className="text-6xl font-light leading-none text-accent">+</span>
                        </div>
                      </Button>
                    );
                  }

                  if (!entry) {
                    return (
                      <div
                        key={`empty-mindset-slot-${safeCollectionMindsetPage}-${slotIndex}`}
                        className="min-w-[170px] flex-1 border border-dashed border-amber-950/14 bg-[#fbf6ec]"
                      />
                    );
                  }

                  if (mindsetListMode === 'foci') {
                    const focus = entry as Focus;

                    return (
                      <Button
                        align="left"
                        key={`${getFocusKey(focus)}-${slotIndex}`}
                        className="min-w-[170px] flex-1 overflow-hidden"
                        onClick={() => handleDraftFocusAssignment(focus)}
                        selected={isEditingMindsetDraft && draftMindsetFoci[selectedDraftMindsetSlot] !== null && getFocusKey(draftMindsetFoci[selectedDraftMindsetSlot] as Focus) === getFocusKey(focus)}
                        variant="surface"
                      >
                        <FocusTile focus={focus} />
                      </Button>
                    );
                  }

                  const mindset = entry as Mindset;
                  const representativeFocus = mindset.foci[0];

                  if (!representativeFocus) {
                    return (
                      <div
                        key={`missing-focus-slot-${safeCollectionMindsetPage}-${slotIndex}`}
                        className="min-w-[170px] flex-1 border border-dashed border-amber-950/14 bg-[#fbf6ec]"
                      />
                    );
                  }

                  const mindsetIndex = safeCollectionMindsetPage * COLLECTION_MINDSET_PAGE_SIZE + slotIndex;
                  const isSelected = mindsetIndex === safeSelectedCollectionMindsetIndex;

                  return (
                    <Button
                      align="left"
                      key={`${mindset.name}-${mindsetIndex}`}
                      className="min-w-[170px] flex-1 overflow-hidden"
                      onClick={() => loadMindsetIntoEditor(mindset, mindsetIndex)}
                      selected={isSelected}
                      variant="surface"
                    >
                      <MindsetTile focus={representativeFocus} name={mindset.name} />
                    </Button>
                  );
                })}
              </div>
            </section>
          </div>
        ) : (
          <div className="mt-5 rounded-[22px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
            <p className="text-sm text-muted">In deiner Sammlung sind noch keine Mindsets verfügbar.</p>
          </div>
        )}

        {activeTab === 'images' || activeTab === 'sayings' ? (
          <form className="mt-5">
            <label className="inline-flex items-center gap-3 rounded-full border border-amber-950/10 bg-white/80 px-4 py-3 text-sm text-ink">
              <Button
                active={activeTab === 'images' ? showCollectionImageIds : showCollectionSayingIds}
                aria-pressed={activeTab === 'images' ? showCollectionImageIds : showCollectionSayingIds}
                className="relative h-7 w-12"
                onClick={() =>
                  activeTab === 'images'
                    ? setShowCollectionImageIds((value) => !value)
                    : setShowCollectionSayingIds((value) => !value)
                }
                shape="pill"
                variant="toggle"
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                    (activeTab === 'images' ? showCollectionImageIds : showCollectionSayingIds) ? 'left-6' : 'left-1'
                  }`}
                />
              </Button>
              <span>{activeTab === 'images' ? 'Image-ID in der Kartenmitte anzeigen' : 'Spruch-ID anzeigen'}</span>
            </label>
          </form>
        ) : null}
      </section>

      {zoomedImage && (activeTab === 'images' || activeTab === 'foci') ? (
        <Button
          aria-label="Vergrößerte Bildansicht schließen"
          className="fixed inset-0 z-50 p-4 sm:p-8"
          onClick={() => setZoomedImageId(null)}
          variant="scrim"
        >
          <img
            alt={zoomedImage.categories.map((category) => category.text).join(', ')}
            className="max-h-full max-w-full rounded-[24px] object-contain shadow-[0_30px_120px_rgba(0,0,0,0.42)]"
            src={zoomedImage.url}
          />
        </Button>
      ) : null}
    </section>
  );
}
