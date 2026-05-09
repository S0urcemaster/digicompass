import { AppShell } from './components/AppShell';
import { CompassView } from './views/CompassView';
import { CollectionView } from './views/CollectionView';
import { NavigatorView } from './views/NavigatorView';
import { useCompassStore } from './store/CompassStore';

const renderView = (activeView: string) => {
  switch (activeView) {
    case 'navigator':
      return <NavigatorView />;
    case 'collection':
      return <CollectionView />;
    case 'compass':
    default:
      return <CompassView />;
  }
};

export const App = () => {
  const { state, dispatch } = useCompassStore();

  return (
    <AppShell
      activeView={state.activeView}
      onChangeView={(view) => dispatch({ type: 'set-active-view', view })}
    >
      {renderView(state.activeView)}
    </AppShell>
  );
};
