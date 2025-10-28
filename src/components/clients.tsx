import * as React from 'react';

type Props = {
    names: string
};

export function Clients({names}: Props) {
    return (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-x-2 gap-y-1">
            {names.split(",").map(clientName => (
                <div key={clientName} className="text-muted-foreground">
                    {clientName.trim()}
                </div>
            ))}
        </div>
    );
}