package com.react_native_demo;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;

import org.lnpbp.rgbnode.Runtime;
import org.lnpbp.rgbnode.model.IssueArgs;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ReactModule extends ReactContextBaseJavaModule {
    public ReactModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "RGB";
    }

    @ReactMethod
    public void issue( // TODO: alternatively we can just take a json string here and pass that directly to the ffi for librgb
            int alloc_coins,
            int alloc_vout,
            String alloc_txid,

            String network,
            String ticker,
            String name,
            String description,
            String issue_structure,
            int precision,

            Promise promise) {
        try {
            final Runtime runtime = ((MainApplication) getCurrentActivity().getApplication()).getRuntime();
            final IssueArgs.CoinAllocation allocation = new IssueArgs.CoinAllocation((long) alloc_coins, alloc_vout, alloc_txid);
            runtime.issue(network, ticker, name, description, issue_structure, Arrays.asList(allocation), precision, new ArrayList(), null);

            WritableMap map = Arguments.createMap();
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void transfer(
            List<String> inputs,
            List<IssueArgs.CoinAllocation> allocate,
            String invoice,
            String prototype_psbt,
            Integer fee,
            String change,
            String consignment_file,
            String transaction_file,
            Promise promise) {
        try {
            final Runtime runtime = ((MainApplication) getCurrentActivity().getApplication()).getRuntime();
            runtime.transfer(inputs, allocate, invoice, prototype_psbt, fee, change, consignment_file, transaction_file);
            WritableMap map = Arguments.createMap();
            promise.resolve(map);
            promise.resolve(runtime);
        } catch (Exception e) {
            promise.reject(e);
        }
    }
}
