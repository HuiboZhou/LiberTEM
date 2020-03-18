import * as React from "react";
import { useSelector } from "react-redux";
import ClusterConnectionForm from "../../cluster/components/ClusterConnectionForm";
import { assertNotReached } from "../../helpers";
import { RootReducer } from "../../store";
import ChannelConnecting from "./ChannelConnecting";

const messages = {
    waiting: "Waiting...",
    connecting: "Connecting...",
}

const clusterMessages = {
    connected: "Connected, waiting for initial state...",
    unknown: "Connected, fetching cluster status...",
}

const ConnectedNotReady: React.SFC = () => {
    const haveConfig = useSelector((state: RootReducer) => state.config.haveConfig);
    const clusterConnection = useSelector((state: RootReducer) => state.clusterConnection);

    if (!haveConfig) {
        return <ChannelConnecting msg="waiting for configuration..." />;
    }
    if (clusterConnection.status === "disconnected") {
        return <ClusterConnectionForm />
    } else if (clusterConnection.status === "connected") {
        return <ChannelConnecting msg={clusterMessages.connected} />;
    } else if (clusterConnection.status === "unknown") {
        return <ChannelConnecting msg={clusterMessages.unknown} />;
    }
    assertNotReached("should not happen");
}

const ChannelStatus: React.SFC = ({ children }) => {
    const channelStatus = useSelector((state: RootReducer) => state.channelStatus);

    switch (channelStatus.status) {
        case "waiting":
        case "connecting": {
            return <ChannelConnecting msg={messages[channelStatus.status]} />;
        }
        case "connected": {
            return <ConnectedNotReady />
        }
        case "ready":
            return <>{children}</>;
        default:
            assertNotReached("should not happen");
    }
}

export default ChannelStatus;