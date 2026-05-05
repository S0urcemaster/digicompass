import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/Button';
import { Tabs } from '../../../components/Tabs';
import { IMAGES } from '../../../data/images';
import { SAYINGS } from '../../../data/sayings';
import { preloadImages } from '../../../lib/imageCache';
import type { CompassImage, Focus, Mindset, Saying } from '../../../types/domain';
import { CollectionImagePanel } from './CollectionImagePanel';
import { FocusTile } from '../shared/FocusTile';
import { StarRating } from '../shared/StarRating';
import {
  getImageBadgeClassName,
  getImageBottomOverlayClassName,
  getImageIdBadgeClassName,
  getImageOverlayTone,
  getImageStarContainerClassName,
} from './imageOverlayTone';

const COLLECTION_TABS = [
  { label: 'Bilder', value: 'images' },
  { label: 'Sprüche', value: 'sayings' },
  { label: 'Foki', value: 'foci' },
  { label: 'Mindsets', value: 'mindsets' },
] as const satisfies ReadonlyArray<{ disabled?: boolean; label: string; value: string }>;

const COLLECTION_IMAGE_PAGE_SIZE = 9;
const COLLECTION_FOCUS_PAGE_SIZE = 9;
const COLLECTION_MINDSET_PAGE_SIZE = 5;
const COLLECTION_SAYING_PAGE_SIZE = 7;
const FOCUS_EDITOR_IMAGE_PAGE_SIZE = 6;
const FOCUS_EDITOR_SAYING_PAGE_SIZE = 4;

const getPreviewImageUrl = (url: string) => url.replace('/images/', '/images/preview/');
const getFocusKey = (focus: Focus) => `${focus.saying.id}:${focus.image.id}`;

const getSayingFontSize = (fontSize: number, expanded = false) =>
  expanded
    ? `clamp(2rem, ${fontSize / 12}vw, ${fontSize * 1.08}px)`
    : `clamp(1.35rem, ${fontSize / 16.2}vw, ${Math.max(29, fontSize * 0.7)}px)`;

const getFocusPreviewFontSize = (fontSize: number) => `${fontSize * 1.25}px`;

type CollectionTabValue = (typeof COLLECTION_TABS)[number]['value'];
type FocusPreviewSource = 'editor' | 'focus';
type MindsetListMode = 'mindsets' | 'foci';

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
  const [collectionFocusFilter, setCollectionFocusFilter] = useState('');
  const [collectionFocusPage, setCollectionFocusPage] = useState(0);
  const [focusPreviewSource, setFocusPreviewSource] = useState<FocusPreviewSource>('focus');
  const [focusEditorImagePage, setFocusEditorImagePage] = useState(0);
  const [focusEditorSayingPage, setFocusEditorSayingPage] = useState(0);
  const [collectionImageFilter, setCollectionImageFilter] = useState('');
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
  const [showCollectionImageIds, setShowCollectionImageIds] = useState(true);
  const [collectionSayingFilter, setCollectionSayingFilter] = useState('');
  const [collectionSayingPage, setCollectionSayingPage] = useState(0);
  const [selectedFocusEditorSayingId, setSelectedFocusEditorSayingId] = useState<number | null>(null);
  const [selectedCollectionSayingId, setSelectedCollectionSayingId] = useState<number | null>(SAYINGS[0]?.id ?? null);
  const [showCollectionSayingIds, setShowCollectionSayingIds] = useState(true);

  const normalizedFocusFilter = collectionFocusFilter.trim().toLowerCase();
  const normalizedImageFilter = collectionImageFilter.trim().toLowerCase();
  const normalizedSayingFilter = collectionSayingFilter.trim().toLowerCase();

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
  const previewOverlayTone = previewFocus ? getImageOverlayTone(previewFocus.image.color) : null;

  const collectionImageById = new Map(collectionImages.map((image) => [image.id, image] as const));
  const filteredCollectionImages = IMAGES.filter((image) =>
    normalizedImageFilter.length === 0
      ? true
      : image.categories.some((category) => category.text.toLowerCase().includes(normalizedImageFilter))
  );
  const visibleCollectionImages = filteredCollectionImages.length > 0 ? filteredCollectionImages : lastVisibleCollectionImages;
  const collectionImagePageCount = Math.max(1, Math.ceil(visibleCollectionImages.length / COLLECTION_IMAGE_PAGE_SIZE));
  const safeCollectionImagePage = Math.min(collectionImagePage, collectionImagePageCount - 1);
  const pagedCollectionImages = visibleCollectionImages.slice(
    safeCollectionImagePage * COLLECTION_IMAGE_PAGE_SIZE,
    (safeCollectionImagePage + 1) * COLLECTION_IMAGE_PAGE_SIZE
  );
  const selectedCollectionImage =
    visibleCollectionImages.find((image) => image.id === selectedCollectionImageId) ?? visibleCollectionImages[0] ?? null;
  const collectedImage = selectedCollectionImage ? collectionImageById.get(selectedCollectionImage.id) ?? null : null;
  const selectedImageDetails = collectedImage ?? selectedCollectionImage;
  const zoomedImage = zoomedImageId === null ? null : IMAGES.find((image) => image.id === zoomedImageId) ?? null;

  const collectionSayingById = new Map(collectionSayings.map((saying) => [saying.id, saying] as const));
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
  const filteredCollectionSayings =
    normalizedSayingFilter.length === 0
      ? SAYINGS
      : [
          ...SAYINGS.filter((saying) => saying.text.toLowerCase().includes(normalizedSayingFilter)),
          ...SAYINGS.filter(
            (saying) =>
              !saying.text.toLowerCase().includes(normalizedSayingFilter) &&
              saying.categories.some((category) => category.text.toLowerCase().includes(normalizedSayingFilter))
          ),
        ];
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
  }, [normalizedImageFilter]);

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
              <label className="block" htmlFor="collection-image-filter">
                <input
                  id="collection-image-filter"
                  className="w-full rounded-full border border-amber-950/10 bg-white/90 px-4 py-2 text-xl font-semibold tracking-tight text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  placeholder="Kategorie"
                  value={collectionImageFilter}
                  onChange={(event) => setCollectionImageFilter(event.target.value)}
                />
              </label>

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

              <CollectionImagePanel
                image={selectedImageDetails}
                onOpenModal={() => setZoomedImageId(selectedCollectionImage.id)}
                onSetRating={handleSetSelectedImageRating}
                showImageId={showCollectionImageIds}
              />

              <section className="flex min-h-0 flex-col">
                {visibleCollectionImages.length > 0 ? (
                  <div className="pr-1">
                    <div className="grid grid-cols-3 gap-3">
                      {pagedCollectionImages.map((image) => {
                        const isSelected = image.id === selectedCollectionImage.id;
                        const collectedListImage = collectionImageById.get(image.id) ?? null;
                        const previewRating = collectedListImage?.rating ?? 0;
                        const overlayTone = getImageOverlayTone(image.color);

                        return (
                          <Button
                            align="left"
                            key={image.id}
                            className="group relative overflow-hidden rounded-[18px]"
                            onClick={() => setSelectedCollectionImageId(image.id)}
                            selected={isSelected}
                            variant="surface"
                          >
                            <img
                              alt={image.categories.map((category) => category.text).join(', ')}
                              className="aspect-[733/1024] w-full object-cover"
                              decoding="async"
                              loading="lazy"
                              src={getPreviewImageUrl(image.url)}
                            />
                            {showCollectionImageIds ? (
                              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                                <div
                                  className={`rounded-full border-0 px-3 py-1.5 text-[1.5rem] font-semibold ${getImageIdBadgeClassName(overlayTone)}`}
                                >
                                  {image.id}
                                </div>
                              </div>
                            ) : null}
                            <div className="absolute left-2 top-2">
                              <p
                                className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getImageBadgeClassName(overlayTone)}`}
                              >
                                {image.categories[0]?.text ?? 'Unsortiert'}
                              </p>
                            </div>
                            <div
                              className={`absolute inset-x-0 bottom-0 px-2 pb-2 pt-8 ${getImageBottomOverlayClassName(overlayTone)}`}
                            >
                              <StarRating
                                className={`w-full justify-center gap-0.5 rounded-full px-1.5 py-1 ${getImageStarContainerClassName(overlayTone)}`}
                                disabled
                                rating={previewRating}
                                starClassName="text-[0.9rem]"
                                tone={overlayTone}
                              />
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
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
                    className="w-full rounded-full border border-amber-950/10 bg-white/90 px-4 py-2 text-xl font-semibold tracking-tight text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
                  <div className="grid grid-cols-1 gap-3">
                    {pagedCollectionSayings.map((saying) => {
                      const collectedListSaying = collectionSayingById.get(saying.id) ?? null;
                      const previewRating = collectedListSaying?.rating ?? 0;

                      return (
                        <article
                          key={saying.id}
                          className="relative overflow-hidden border border-amber-950/12 bg-[var(--button-bg-light)] transition"
                        >
                          <button
                            className="absolute inset-0 z-0"
                            aria-label={`Spruch ${saying.id} auswählen`}
                            onClick={() => setSelectedCollectionSayingId(saying.id)}
                            type="button"
                          />
                          <div className="relative z-10 flex h-full flex-col gap-3 px-4 py-3 sm:px-5">
                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                              <div className="flex items-start justify-between gap-3">
                                <div
                                  className={`min-w-0 ${showCollectionSayingIds ? 'grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2' : 'block'}`}
                                >
                                  {showCollectionSayingIds ? (
                                    <div className="border border-amber-950/12 bg-[var(--button-bg-light)] px-2.5 py-1 text-sm font-semibold text-[#1f1712]">
                                      {saying.id}
                                    </div>
                                  ) : null}
                                  <p className="min-w-0 border border-amber-950/12 bg-[var(--button-bg-light)] px-2.5 py-1 text-[32px] font-medium text-[#6c6258]">
                                    {saying.categories.length > 0
                                      ? saying.categories.map((category) => category.text).join('   ')
                                      : 'Unsortiert'}
                                  </p>
                                </div>
                                <StarRating
                                  className="relative z-10 shrink-0 items-start justify-center self-start border border-amber-950/12 bg-[var(--button-bg-light)] px-2 py-0 text-[#1f1712]"
                                  rating={previewRating}
                                  buttonClassName="flex h-[1.9rem] w-[1.9rem] items-center justify-center p-0 leading-none"
                                  starClassName="text-[2.3rem] leading-none"
                                  tone="dark"
                                  onChange={(rating) => handleSetSayingRating(saying, rating)}
                                />
                              </div>
                              <p
                                className="w-full font-semibold tracking-[-0.04em] text-[#1f1712]"
                                style={{ fontSize: getSayingFontSize(saying.fontSize), lineHeight: 1.1 }}
                              >
                                {saying.text}
                              </p>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
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
                <label className="block" htmlFor="collection-focus-filter">
                  <input
                    id="collection-focus-filter"
                    className="w-full rounded-full border border-amber-950/10 bg-white/90 px-4 py-2 text-xl font-semibold tracking-tight text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="Kategorie"
                    value={collectionFocusFilter}
                    onChange={(event) => setCollectionFocusFilter(event.target.value)}
                  />
                </label>

                <div>
                  {filteredCollectionFoci.length > 0 ? (
                    <div className="flex items-center gap-3">
                      <Button
                        aria-label="Vorherige Fokusseite"
                        className="flex-1"
                        disabled={safeCollectionFocusPage === 0}
                        fullWidth
                        onClick={() => setCollectionFocusPage((page) => Math.max(0, page - 1))}
                        shape="pill"
                        variant="pager"
                      >
                        ←
                      </Button>
                      <div className="min-w-[6rem] text-center text-base font-semibold text-muted">
                        {safeCollectionFocusPage + 1} / {collectionFocusPageCount}
                      </div>
                      <Button
                        aria-label="Nächste Fokusseite"
                        className="flex-1"
                        disabled={safeCollectionFocusPage >= collectionFocusPageCount - 1}
                        fullWidth
                        onClick={() => setCollectionFocusPage((page) => Math.min(collectionFocusPageCount - 1, page + 1))}
                        shape="pill"
                        variant="pager"
                      >
                        →
                      </Button>
                    </div>
                  ) : null}
                </div>

                {previewFocus ? (
                  <CollectionImagePanel
                    image={{ ...previewFocus.image, rating: storedPreviewFocus?.rating ?? previewFocus.rating }}
                    onOpenModal={() => setZoomedImageId(previewFocus.image.id)}
                    onSetRating={
                      focusPreviewSource === 'editor'
                        ? handleSetEditorFocusRating
                        : storedPreviewFocus
                          ? (rating) => handleSetFocusRating(storedPreviewFocus, rating)
                          : undefined
                    }
                    topContent={
                      <div
                        className={`max-w-[26rem] rounded-[24px] px-5 py-4 text-left shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-[3px] ${
                          previewOverlayTone === 'light' ? 'bg-[#1f1712]/72 text-[#fff7ed]' : 'bg-[#fff7ed]/78 text-[#1f1712]'
                        }`}
                      >
                        <p
                          className={`text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${
                            previewOverlayTone === 'light' ? 'text-[#fff7ed]/80' : 'text-[#1f1712]/72'
                          }`}
                        >
                          {previewFocus.image.categories[0]?.text ?? 'Unsortiert'}
                        </p>
                        <p
                          className="mt-3 font-semibold tracking-[-0.04em]"
                          style={{ fontSize: getFocusPreviewFontSize(previewFocus.saying.fontSize), lineHeight: 1.08 }}
                        >
                          {previewFocus.saying.text}
                        </p>
                      </div>
                    }
                  />
                ) : (
                  <div className="rounded-[28px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
                    <p className="text-sm text-muted">Wähle unten ein Bild und einen Spruch oder rechts einen bestehenden Fokus.</p>
                  </div>
                )}

                <section className="flex min-h-0 flex-col">
                  {filteredCollectionFoci.length > 0 ? (
                    <div className="pr-1">
                      <div className="grid grid-cols-3 gap-3">
                        {pagedCollectionFoci.map((focus) => {
                          const focusKey = getFocusKey(focus);
                          const isSelected = focusKey === (selectedCollectionFocus ? getFocusKey(selectedCollectionFocus) : null);
                          const overlayTone = getImageOverlayTone(focus.image.color);

                          return (
                            <Button
                              align="left"
                              key={focusKey}
                              className="group relative overflow-hidden rounded-[18px]"
                              onClick={() => {
                                setSelectedCollectionFocusKey(focusKey);
                                setFocusPreviewSource('focus');
                              }}
                              selected={isSelected}
                              variant="surface"
                            >
                              <img
                                alt={focus.image.categories.map((category) => category.text).join(', ')}
                                className="aspect-[733/1024] w-full object-cover"
                                decoding="async"
                                loading="lazy"
                                src={getPreviewImageUrl(focus.image.url)}
                              />
                              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-2">
                                <div className="rounded-[14px] bg-black/32 px-3 py-2 text-left text-white shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur-[3px]">
                                  <p className="line-clamp-4 text-sm font-semibold leading-[1.05] tracking-[-0.04em]">
                                    {focus.saying.text}
                                  </p>
                                </div>
                              </div>
                              <div className="absolute left-2 top-2 pt-[5.8rem]">
                                <p
                                  className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getImageBadgeClassName(overlayTone)}`}
                                >
                                  {focus.image.categories[0]?.text ?? 'Unsortiert'}
                                </p>
                              </div>
                              <div
                                className={`absolute inset-x-0 bottom-0 px-2 pb-2 pt-8 ${getImageBottomOverlayClassName(overlayTone)}`}
                              >
                                <StarRating
                                  className={`w-full justify-center gap-0.5 rounded-full px-1.5 py-1 ${getImageStarContainerClassName(overlayTone)}`}
                                  disabled
                                  rating={focus.rating}
                                  starClassName="text-[0.9rem]"
                                  tone={overlayTone}
                                />
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[20px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
                      <p className="text-sm text-muted">Keine Foki passen zu diesem Kategorienfilter.</p>
                    </div>
                  )}
                </section>
              </div>

              <div className="grid gap-5 min-[980px]:grid-cols-2 min-[980px]:items-start">
                <section className="space-y-4">
                  <div>
                    {filteredFocusEditorImages.length > 0 ? (
                      <div className="flex w-full items-center gap-3">
                        <Button
                          aria-label="Vorherige User-Bildseite"
                          className="flex-1"
                          disabled={safeFocusEditorImagePage === 0}
                          fullWidth
                          onClick={() => setFocusEditorImagePage((page) => Math.max(0, page - 1))}
                          shape="pill"
                          variant="pager"
                        >
                          ←
                        </Button>
                        <div className="min-w-[5.5rem] text-center text-base font-semibold text-muted">
                          {safeFocusEditorImagePage + 1} / {focusEditorImagePageCount}
                        </div>
                        <Button
                          aria-label="Nächste User-Bildseite"
                          className="flex-1"
                          disabled={safeFocusEditorImagePage >= focusEditorImagePageCount - 1}
                          fullWidth
                          onClick={() => setFocusEditorImagePage((page) => Math.min(focusEditorImagePageCount - 1, page + 1))}
                          shape="pill"
                          variant="pager"
                        >
                          →
                        </Button>
                      </div>
                    ) : null}
                  </div>

                  {filteredFocusEditorImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {pagedFocusEditorImages.map((image) => {
                        const isSelected = image.id === selectedFocusEditorImage?.id;
                        const overlayTone = getImageOverlayTone(image.color);

                        return (
                          <Button
                            align="left"
                            key={image.id}
                            className="group relative overflow-hidden rounded-[18px]"
                            onClick={() => {
                              setSelectedFocusEditorImageId(image.id);
                              setFocusPreviewSource('editor');
                            }}
                            selected={isSelected}
                            variant="surface"
                          >
                            <img
                              alt={image.categories.map((category) => category.text).join(', ')}
                              className="aspect-[733/1024] w-full object-cover"
                              decoding="async"
                              loading="lazy"
                              src={getPreviewImageUrl(image.url)}
                            />
                            <div className="absolute left-2 top-2">
                              <p
                                className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getImageBadgeClassName(overlayTone)}`}
                              >
                                {image.categories[0]?.text ?? 'Unsortiert'}
                              </p>
                            </div>
                            <div
                              className={`absolute inset-x-0 bottom-0 px-2 pb-2 pt-8 ${getImageBottomOverlayClassName(overlayTone)}`}
                            >
                              <StarRating
                                className={`w-full justify-center gap-0.5 rounded-full px-1.5 py-1 ${getImageStarContainerClassName(overlayTone)}`}
                                disabled
                                rating={image.rating}
                                starClassName="text-[0.9rem]"
                                tone={overlayTone}
                              />
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-[20px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
                      <p className="text-sm text-muted">In deiner Sammlung passen keine Bilder zu diesem Filter.</p>
                    </div>
                  )}
                </section>

                <section className="space-y-4">
                  <div>
                    {filteredFocusEditorSayings.length > 0 ? (
                      <div className="flex w-full items-center gap-3">
                        <Button
                          aria-label="Vorherige User-Spruchseite"
                          className="flex-1"
                          disabled={safeFocusEditorSayingPage === 0}
                          fullWidth
                          onClick={() => setFocusEditorSayingPage((page) => Math.max(0, page - 1))}
                          shape="pill"
                          variant="pager"
                        >
                          ←
                        </Button>
                        <div className="min-w-[5.5rem] text-center text-base font-semibold text-muted">
                          {safeFocusEditorSayingPage + 1} / {focusEditorSayingPageCount}
                        </div>
                        <Button
                          aria-label="Nächste User-Spruchseite"
                          className="flex-1"
                          disabled={safeFocusEditorSayingPage >= focusEditorSayingPageCount - 1}
                          fullWidth
                          onClick={() => setFocusEditorSayingPage((page) => Math.min(focusEditorSayingPageCount - 1, page + 1))}
                          shape="pill"
                          variant="pager"
                        >
                          →
                        </Button>
                      </div>
                    ) : null}
                  </div>

                  {filteredFocusEditorSayings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {pagedFocusEditorSayings.map((saying) => {
                        const isSelected = saying.id === selectedFocusEditorSaying?.id;

                        return (
                          <article
                            key={saying.id}
                            className={`relative cursor-pointer overflow-hidden border border-amber-950/12 bg-[var(--button-bg-light)] transition ${
                              isSelected ? 'ring-2 ring-accent/40' : ''
                            }`}
                            onClick={() => {
                              setSelectedFocusEditorSayingId(saying.id);
                              setFocusPreviewSource('editor');
                            }}
                          >
                            <button
                              className="absolute inset-0 z-0"
                              aria-label={`User-Spruch ${saying.id} auswählen`}
                              onClick={() => {
                                setSelectedFocusEditorSayingId(saying.id);
                                setFocusPreviewSource('editor');
                              }}
                              type="button"
                            />
                            <div className="relative z-10 flex h-full flex-col gap-3 px-4 py-3 sm:px-5">
                              <div className="flex min-w-0 flex-1 flex-col gap-2">
                                <div className="flex items-start justify-between gap-3">
                                  <p className="min-w-0 border border-amber-950/12 bg-[var(--button-bg-light)] px-2.5 py-1 text-[24px] font-medium text-[#6c6258]">
                                    {saying.categories.length > 0
                                      ? saying.categories.map((category) => category.text).join('   ')
                                      : 'Unsortiert'}
                                  </p>
                                  <StarRating
                                    className="relative z-10 shrink-0 items-start justify-center self-start border border-amber-950/12 bg-[var(--button-bg-light)] px-2 py-0 text-[#1f1712]"
                                    rating={saying.rating}
                                    buttonClassName="flex h-[1.45rem] w-[1.45rem] items-center justify-center p-0 leading-none"
                                    starClassName="text-[1.7rem] leading-none"
                                    tone="dark"
                                    onChange={(rating) => handleSetSayingRating(saying, rating)}
                                  />
                                </div>
                                <p
                                  className="w-full font-semibold tracking-[-0.04em] text-[#1f1712]"
                                  style={{ fontSize: getSayingFontSize(saying.fontSize), lineHeight: 1.1 }}
                                >
                                  {saying.text}
                                </p>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-[20px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
                      <p className="text-sm text-muted">In deiner Sammlung passen keine Sprüche zu diesem Filter.</p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[22px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
              <p className="text-sm text-muted">In deiner Sammlung sind noch keine Foki verfügbar.</p>
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
                        className="mt-1 w-full rounded-full border border-amber-950/10 bg-white/90 px-4 py-2 text-xl font-semibold tracking-tight text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                        placeholder="Name"
                        value={draftMindsetName}
                        onChange={(event) => handleDraftMindsetNameChange(event.target.value)}
                      />
                      <p className="mt-2 text-sm text-muted">
                        {activeMindsetDraftCategories.join(' / ') || 'Wähle unten Foki und fülle damit die Slots.'}
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
                  className="shrink-0 items-start justify-center rounded-full border border-amber-950/10 bg-white/85 px-2.5 py-1 text-[#1f1712]"
                  rating={isEditingMindsetDraft ? draftMindsetRating : selectedCollectionMindset?.rating ?? 0}
                  buttonClassName="flex h-[1.85rem] w-[1.85rem] items-center justify-center p-0 leading-none"
                  starClassName="text-[2.15rem] leading-none"
                  tone="dark"
                  onChange={handleSetMindsetRating}
                />
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {visibleMindsetEditorSlots.map((focus, index) =>
                  focus ? (
                    <Button
                      align="left"
                      key={`${isEditingMindsetDraft ? 'draft' : selectedCollectionMindset.name}-${getFocusKey(focus)}-${index}`}
                      className="min-w-[150px] flex-1 overflow-hidden rounded-[20px]"
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
                      className="min-w-[150px] flex-1 overflow-hidden rounded-[20px]"
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
                  <div className="flex min-h-[12rem] w-full items-center justify-center rounded-[20px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 text-center text-sm text-muted">
                    Noch keine Foki im aktiven Mindset.
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
                    { label: 'Foki', value: 'foci' },
                  ]}
                  onChange={setMindsetListMode}
                />

                <div className="flex items-center gap-3">
                  <Button
                    aria-label={`Vorherige ${mindsetListMode === 'mindsets' ? 'Mindset-' : 'Foki-'}Seite`}
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
                    aria-label={`Nächste ${mindsetListMode === 'mindsets' ? 'Mindset-' : 'Foki-'}Seite`}
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
                        className="min-w-[170px] flex-1 overflow-hidden rounded-[20px]"
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
                        className="min-w-[170px] flex-1 rounded-[20px] border border-dashed border-amber-950/14 bg-[#fbf6ec]"
                      />
                    );
                  }

                  if (mindsetListMode === 'foci') {
                    const focus = entry as Focus;

                    return (
                      <Button
                        align="left"
                        key={`${getFocusKey(focus)}-${slotIndex}`}
                        className="min-w-[170px] flex-1 overflow-hidden rounded-[20px]"
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
                        className="min-w-[170px] flex-1 rounded-[20px] border border-dashed border-amber-950/14 bg-[#fbf6ec]"
                      />
                    );
                  }

                  const mindsetIndex = safeCollectionMindsetPage * COLLECTION_MINDSET_PAGE_SIZE + slotIndex;
                  const isSelected = mindsetIndex === safeSelectedCollectionMindsetIndex;

                  return (
                    <Button
                      align="left"
                      key={`${mindset.name}-${mindsetIndex}`}
                      className="min-w-[170px] flex-1 overflow-hidden rounded-[20px]"
                      onClick={() => loadMindsetIntoEditor(mindset, mindsetIndex)}
                      selected={isSelected}
                      variant="surface"
                    >
                      <div className="relative">
                        <FocusTile focus={representativeFocus} />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/78 via-black/32 to-transparent px-3 pb-3 pt-10 text-left text-white">
                          <p className="text-lg font-semibold tracking-[-0.03em]">{mindset.name}</p>
                        </div>
                      </div>
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
