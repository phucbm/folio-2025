import * as React from 'react';

type Props = {
    names: string
};

export function Clients({names}: Props) {
    return (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 border-t border-l border-border">
            {names.split(",").map(clientName => (
                <div key={clientName}
                     className="border-r border-b border-border px-3 py-2 text-xs uppercase tracking-widest text-foreground">
                    {clientName.trim()}
                </div>
            ))}
        </div>
    );
}