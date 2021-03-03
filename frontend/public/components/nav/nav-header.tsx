import * as React from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownItem, DropdownToggle, Title } from '@patternfly/react-core';
import { CaretDownIcon, DomainIcon } from '@patternfly/react-icons';
import { Perspective, useExtensions, isPerspective } from '@console/plugin-sdk';
import { RootState } from '../../redux';
import { featureReducerName, getFlagsObject, FlagsObject } from '../../reducers/features';
import { history } from '../utils';
import { useActivePerspective } from '@console/shared';
import { K8sResourceKind, referenceForModel } from '../../module/k8s';
import { ConsoleLinkModel } from '../../models';
import { useK8sWatchResource } from '../utils/k8s-watch-hook';
import { useTranslation } from 'react-i18next';

type StateProps = {
  flags: FlagsObject;
};

export type NavHeaderProps = {
  onPerspectiveSelected: () => void;
};

export const ACM_LINK_ID = 'acm-console-link';

const getACMConsoleLink = (links: K8sResourceKind[]): K8sResourceKind =>
  links.find(
    (link) => link.spec.location === 'ApplicationMenu' && link.metadata.name === ACM_LINK_ID,
  );

const NavHeader_: React.FC<NavHeaderProps & StateProps> = ({ onPerspectiveSelected, flags }) => {
  const [activePerspective, setActivePerspective] = useActivePerspective();
  const [isPerspectiveDropdownOpen, setPerspectiveDropdownOpen] = React.useState(false);
  const perspectiveExtensions = useExtensions<Perspective>(isPerspective);
  const [consoleLinks] = useK8sWatchResource<K8sResourceKind[]>({
    isList: true,
    kind: referenceForModel(ConsoleLinkModel),
    optional: true,
  });
  const { t } = useTranslation();
  const acmLink: K8sResourceKind = getACMConsoleLink(consoleLinks);
  const togglePerspectiveOpen = React.useCallback(() => {
    setPerspectiveDropdownOpen(!isPerspectiveDropdownOpen);
  }, [isPerspectiveDropdownOpen]);

  const onPerspectiveSelect = React.useCallback(
    (event: React.MouseEvent<HTMLLinkElement>, perspective: Perspective): void => {
      event.preventDefault();
      if (perspective.properties.id !== activePerspective) {
        setActivePerspective(perspective.properties.id);
        history.push(perspective.properties.getLandingPageURL(flags));
      }

      setPerspectiveDropdownOpen(false);
      onPerspectiveSelected && onPerspectiveSelected();
    },
    [activePerspective, flags, onPerspectiveSelected, setActivePerspective],
  );

  const renderToggle = React.useCallback(
    (icon: React.ReactNode, name: string) => (
      <DropdownToggle
        isOpen={isPerspectiveDropdownOpen}
        onToggle={togglePerspectiveOpen}
        toggleIndicator={CaretDownIcon}
        data-test-id="perspective-switcher-toggle"
      >
        <Title headingLevel="h2" size="md">
          <span className="oc-nav-header__icon">{icon}</span>
          {name}
        </Title>
      </DropdownToggle>
    ),
    [isPerspectiveDropdownOpen, togglePerspectiveOpen],
  );

  const perspectiveItems = React.useMemo(() => {
    const items = perspectiveExtensions.map((nextPerspective: Perspective) => (
      <DropdownItem
        key={nextPerspective.properties.id}
        onClick={(event: React.MouseEvent<HTMLLinkElement>) =>
          onPerspectiveSelect(event, nextPerspective)
        }
        isHovered={nextPerspective.properties.id === activePerspective}
      >
        <Title headingLevel="h2" size="md" data-test-id="perspective-switcher-menu-option">
          <span className="oc-nav-header__icon">{nextPerspective.properties.icon}</span>
          {nextPerspective.properties.name}
        </Title>
      </DropdownItem>
    ));
    if (acmLink) {
      items.push(
        <DropdownItem
          key={ACM_LINK_ID}
          onClick={() => {
            window.location.href = acmLink.spec.href;
          }}
          isHovered={ACM_LINK_ID === activePerspective}
        >
          <Title headingLevel="h2" size="md" data-test-id="perspective-switcher-menu-option">
            <span className="oc-nav-header__icon">
              <DomainIcon />
            </span>
            {t('public~Advanced Cluster Management')}
          </Title>
        </DropdownItem>,
      );
    }
    return items;
  }, [acmLink, activePerspective, onPerspectiveSelect, perspectiveExtensions, t]);

  const { icon, name } = React.useMemo(
    () => perspectiveExtensions.find((p) => p.properties.id === activePerspective).properties,
    [activePerspective, perspectiveExtensions],
  );

  return (
    <div
      className="oc-nav-header"
      data-tour-id="tour-perspective-dropdown"
      data-quickstart-id="qs-perspective-switcher"
    >
      <Dropdown
        isOpen={isPerspectiveDropdownOpen}
        toggle={renderToggle(icon, name)}
        dropdownItems={perspectiveItems}
        data-test-id="perspective-switcher-menu"
      />
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  flags: getFlagsObject(state),
});

export default connect<StateProps, {}, NavHeaderProps, RootState>(mapStateToProps, null, null, {
  areStatesEqual: (next, prev) => next[featureReducerName] === prev[featureReducerName],
})(NavHeader_);
