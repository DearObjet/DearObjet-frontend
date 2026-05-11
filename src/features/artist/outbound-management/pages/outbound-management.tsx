import { useEffect, useState } from 'react';

import { ShopList } from '../components/shop-list';
import { OutboundList } from '../components/outbound-list';
import { OutboundProductList } from '../components/outbound-product-list';
import {
  useGetRecentShipmentProductsQuery,
  useGetShipmentProductsQuery,
  useGetShipmentShopsQuery,
} from '../api/outbound-api';
import type {
  Shop,
  ShopItemResponse,
} from '../types/outbound-management-types';

const toShop = (item: ShopItemResponse): Shop => ({
  contractId: item.contractId,
  shopId: item.shopId,
  name: item.shopName,
  category: item.specialty,
  contractStart: item.contractStartDate,
  contractEnd: item.contractEndDate,
  statusCode: item.inboundStatusCode,
  statusLabel: item.inboundStatusLabel,
});

export const OutboundManagement = () => {
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [outboundShopId, setOutboundShopId] = useState<number | null>(null);
  const [isRecentMode, setIsRecentMode] = useState(false);

  const {
    data: shopsData,
    isLoading: isShopsLoading,
    refetch: refetchShops,
  } = useGetShipmentShopsQuery();
  const { currentData: allProductsData } = useGetShipmentProductsQuery(
    { shopId: outboundShopId! },
    {
      skip: outboundShopId === null || isRecentMode,
      refetchOnMountOrArgChange: true,
    }
  );
  const { currentData: recentProductsData } = useGetRecentShipmentProductsQuery(
    { shopId: outboundShopId! },
    {
      skip: outboundShopId === null || !isRecentMode,
      refetchOnMountOrArgChange: true,
    }
  );

  const rawOutboundData = isRecentMode ? recentProductsData : allProductsData;
  const outboundData = outboundShopId !== null ? rawOutboundData : undefined;
  const shops: Shop[] = (shopsData?.items ?? []).map(toShop);

  const handleShopRowClick = (shop: Shop) => {
    setSelectedShopId((prev) => (prev === shop.shopId ? null : shop.shopId));
  };

  const handleOutboundView = (shopId: number) => {
    setOutboundShopId(shopId);
    setIsRecentMode(false);
  };

  const handleToggleRecentMode = () => {
    setIsRecentMode((prev) => !prev);
  };

  const handleOutboundSuccess = () => {
    setSelectedShopId(null);
    setOutboundShopId(null);
    setIsRecentMode(false);
    refetchShops();
  };

  useEffect(() => {
    setOutboundShopId(null);
    setIsRecentMode(false);
  }, [selectedShopId]);

  return (
    <div className="h-full flex-1 overflow-hidden bg-gray-100">
      <div className="grid h-full grid-cols-2 gap-3">
        <div className="flex flex-col gap-3 overflow-hidden">
          <ShopList
            shops={shops}
            isLoading={isShopsLoading}
            selectedId={selectedShopId}
            onRowClick={handleShopRowClick}
            onOutboundView={handleOutboundView}
          />
          <OutboundList
            data={outboundData}
            isRecentMode={isRecentMode}
            onToggleMode={handleToggleRecentMode}
          />
        </div>

        <OutboundProductList
          shopId={selectedShopId}
          onOutboundSuccess={handleOutboundSuccess}
        />
      </div>
    </div>
  );
};
