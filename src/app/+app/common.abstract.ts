import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

export abstract class AppCommonAbstract implements OnDestroy {
  protected onDestroy$: Subject<undefined> = new Subject();
  protected changeDetectorRef: ChangeDetectorRef;

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  protected onActionFinished<T>(success: boolean, obj: T, setter: (d: T) => void, form: NgForm): void {
    if (success) {
      if (form) {
        setter(<any>{});
        form.reset();
      }
    } else {
      setter({...<any>obj, working: undefined});
    }
    if (this.changeDetectorRef) {
      this.changeDetectorRef.markForCheck();
    }
  }

  trackMember(index: number, {member}: {member: string} & any): string {
    return member || undefined;
  }

  trackGratitude(index: number): string {
    return `${index}` || undefined;
  }

  trackPoll(index: number, poll: {address: string}): string {
    return poll && poll.address;
  }
}
