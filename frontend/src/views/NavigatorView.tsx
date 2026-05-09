import { ViewPanel } from '../components/ViewPanel';
import { useCompassStore } from '../store/CompassStore';

export const NavigatorView = () => {
  const {
    state: {
      data: { collection },
    },
  } = useCompassStore();

  return (
    <ViewPanel
      text="The base library is loaded. The next slice should add category-driven browsing and collection actions."
      title="Navigator"
    >
      <div className="stats-grid">
        <div className="stat-tile">
          <strong>{collection.sayings.length}</strong>
          <span>Sayings in library</span>
        </div>
        <div className="stat-tile">
          <strong>{collection.images.length}</strong>
          <span>Images in library</span>
        </div>
      </div>
    </ViewPanel>
  );
};
